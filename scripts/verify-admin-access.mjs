/**
 * End-to-end verification of the admin role gate.
 *
 * Creates a throwaway user, exercises the role checks against a running dev
 * server (http://localhost:3000 by default), then deletes the user and its
 * profile row again.
 *
 * Usage:  node scripts/verify-admin-access.mjs
 */

import { readFileSync } from "node:fs";
import { createServerClient } from "@supabase/ssr";

/**
 * Minimal .env.local loader — values may contain spaces and parentheses, so
 * they are parsed line by line rather than shell-sourced.
 */
function loadEnvFile(path) {
  let contents = "";
  try {
    contents = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP = process.env.APP_URL ?? "http://localhost:3000";

for (const [name, value] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
})) {
  if (!value) {
    console.error(`Missing env var: ${name}. Load .env.local before running.`);
    process.exit(1);
  }
}

const EMAIL = `admin-probe-${Date.now()}@example.com`;
const PASSWORD = "Pr0be!Pass123";

const adminApi = async (path, method = "GET", body) => {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try {
    return { status: res.status, json: JSON.parse(text) };
  } catch {
    return { status: res.status, json: text };
  }
};

const results = [];
const check = (label, pass, detail) => {
  results.push({ label, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? ` -> ${detail}` : ""}`);
};

let probeId = "";

try {
  const created = await adminApi("/auth/v1/admin/users", "POST", {
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  probeId = created.json.id;
  if (!probeId) throw new Error(`Could not create probe user: ${JSON.stringify(created.json)}`);

  // Sign in the way the browser does, capturing the session cookies.
  const jar = {};
  const supabase = createServerClient(SUPABASE_URL, ANON_KEY, {
    cookies: {
      getAll: () => Object.entries(jar).map(([name, value]) => ({ name, value })),
      setAll: (list) => list.forEach(({ name, value }) => { jar[name] = value; }),
    },
  });

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (signInError) throw new Error(`Sign-in failed: ${signInError.message}`);

  const cookieHeader = Object.entries(jar)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  const hit = async (path) =>
    fetch(`${APP}${path}`, { headers: { cookie: cookieHeader }, redirect: "manual" });

  // 1) Signed out -> /auth/sign-in
  let res = await fetch(`${APP}/admin`, { redirect: "manual" });
  check(
    "signed out /admin redirects to sign-in",
    res.status === 307 && (res.headers.get("location") ?? "").includes("/auth/sign-in"),
    `${res.status} ${res.headers.get("location") ?? ""}`
  );

  // 2) Guest (role = 'guest') -> /dashboard
  await adminApi(`/rest/v1/profiles?id=eq.${probeId}`, "PATCH", { role: "guest" });
  res = await hit("/admin");
  check(
    "guest /admin redirects to /dashboard",
    res.status === 307 && (res.headers.get("location") ?? "").includes("/dashboard"),
    `${res.status} ${res.headers.get("location") ?? ""}`
  );

  // 3) Admin -> renders
  await adminApi(`/rest/v1/profiles?id=eq.${probeId}`, "PATCH", { role: "admin" });
  res = await hit("/admin");
  check("admin /admin renders", res.status === 200, `${res.status}`);

  // 4) The Navbar account endpoint reports the role
  const api = await fetch(`${APP}/api/account/profile`, {
    headers: { cookie: cookieHeader },
  });
  const body = await api.json();
  check(
    "/api/account/profile returns role=admin",
    api.status === 200 && body.role === "admin",
    JSON.stringify(body)
  );

  // 5) The profiles table is readable by an authenticated user (no 42P17)
  const rls = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=id,role&id=eq.${probeId}`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`,
      },
    }
  );
  const rlsBody = await rls.text();
  check(
    "authenticated read of profiles is not blocked by RLS recursion",
    !rlsBody.includes("42P17"),
    rlsBody.slice(0, 120)
  );
} finally {
  if (probeId) {
    await adminApi(`/rest/v1/profiles?id=eq.${probeId}`, "DELETE");
    const cleanup = await adminApi(`/auth/v1/admin/users/${probeId}`, "DELETE");
    console.log(`\nCleanup: probe user deleted (${cleanup.status}).`);
  }
}

const failed = results.filter((r) => !r.pass);
console.log(
  failed.length === 0
    ? `\nAll ${results.length} checks passed.`
    : `\n${failed.length} of ${results.length} checks FAILED.`
);
process.exit(failed.length === 0 ? 0 : 1);
