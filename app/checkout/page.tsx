import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import CheckoutForm from "./checkout-form";

export const instant = false;

interface CheckoutSearchParams {
  suiteId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  total?: string;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<CheckoutSearchParams>;
}) {
  const params = await searchParams;
  const { suiteId, checkIn, checkOut, guests, total } = params;

  // Server-side session check — redirect unauthenticated users to sign-in
  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only in Server Component
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectTo = `/checkout?suiteId=${suiteId ?? ""}&checkIn=${checkIn ?? ""}&checkOut=${checkOut ?? ""}&guests=${guests ?? ""}&total=${total ?? ""}`;
    redirect(`/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return (
    <CheckoutForm
      user={user!}
      suiteId={suiteId ?? ""}
      checkIn={checkIn ?? ""}
      checkOut={checkOut ?? ""}
      guests={guests ?? "1"}
      total={total ?? "0"}
    />
  );
}
