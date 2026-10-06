import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function supabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function supabaseAnonKey() {
  return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    supabaseUrl()!,
    supabaseAnonKey()!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components can read the session. The login action writes the cookies.
          }
        },
      },
    },
  );
}
