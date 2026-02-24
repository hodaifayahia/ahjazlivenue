import { createBrowserClient } from "@supabase/ssr";
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from "./env";

const supabaseUrl = resolveSupabaseUrl();
const supabaseAnonKey = resolveSupabaseAnonKey();

export const createClient = () =>
    createBrowserClient(
        supabaseUrl!,
        supabaseAnonKey!
    );