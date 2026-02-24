import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type cookies } from "next/headers";
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from "./env";

const supabaseUrl = resolveSupabaseUrl();
const supabaseKey = resolveSupabaseAnonKey();

// Type for the awaited result of cookies()
type CookieStore = Awaited<ReturnType<typeof cookies>>;

export const createClient = (cookieStore: CookieStore) => {
    return createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
};
