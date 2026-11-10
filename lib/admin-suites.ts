/**
 * Server-side suite CRUD for the admin panel.
 *
 * Uses the service-role client so the reads bypass RLS — the admin pages run
 * on the server and never need the browser to attach a user JWT.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import {
  mapSuiteRow,
  slugifySuiteName,
  toSuiteRow,
  type SuiteRow,
} from "@/lib/suites-data";
import type { Suite, SuiteInput } from "@/types/suite";

const TABLE = "suites";

export async function adminGetSuites(): Promise<Suite[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load suites: ${error.message}`);
  }

  return (data as SuiteRow[]).map(mapSuiteRow);
}

export async function adminCreateSuite(input: SuiteInput): Promise<Suite> {
  const supabase = createAdminClient();

  const row = {
    ...toSuiteRow(input),
    slug: input.slug || slugifySuiteName(input.name),
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create suite: ${error.message}`);
  }

  return mapSuiteRow(data as SuiteRow);
}

export async function adminUpdateSuite(
  id: string,
  input: Partial<SuiteInput>
): Promise<Suite> {
  const supabase = createAdminClient();

  const row = toSuiteRow(input);
  if (input.slug === undefined && input.name !== undefined) {
    row.slug = slugifySuiteName(input.name);
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update suite: ${error.message}`);
  }

  return mapSuiteRow(data as SuiteRow);
}

export async function adminDeleteSuite(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete suite: ${error.message}`);
  }
}
