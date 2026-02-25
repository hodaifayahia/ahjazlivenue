import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./env";

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig();

export const createClient = () =>
    createBrowserClient(
        supabaseUrl!,
        supabaseAnonKey!
    );