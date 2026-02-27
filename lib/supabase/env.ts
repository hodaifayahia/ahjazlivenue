const looksLikeHttpUrl = (value: string) =>
    value.startsWith('http://') || value.startsWith('https://');

const FALLBACK_SUPABASE_URL = 'https://example.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_placeholder_key';

const deriveApiUrlFromDatabaseUrl = (databaseUrl: string): string | undefined => {
    const match = databaseUrl.match(/@(?:db\.)?([a-z0-9-]+)\.supabase\.co(?::\d+)?\//i);
    if (!match?.[1]) {
        return undefined;
    }

    return `https://${match[1]}.supabase.co`;
};

export function resolveSupabaseUrl(): string | undefined {
    const directUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.SUPABASE_URL;

    if (directUrl && looksLikeHttpUrl(directUrl)) {
        return directUrl;
    }

    const databaseUrl = process.env.SUPABASE_DATABASE_URL;
    if (!databaseUrl) {
        return undefined;
    }

    if (looksLikeHttpUrl(databaseUrl)) {
        return databaseUrl;
    }

    return deriveApiUrlFromDatabaseUrl(databaseUrl);
}

export function resolveSupabaseAnonKey(): string | undefined {
    return (
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        process.env.PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY
    );
}

function isValidHttpUrl(value: string | undefined): boolean {
    if (!value || !looksLikeHttpUrl(value)) {
        return false;
    }

    try {
        const parsed = new URL(value);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
        return false;
    }
}

export function getSupabaseConfig(): { url: string; anonKey: string } {
    const url = resolveSupabaseUrl();
    const anonKey = resolveSupabaseAnonKey();

    if (!isValidHttpUrl(url) || !anonKey) {
        console.error('[Supabase] Missing or invalid environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or Netlify Supabase extension vars) are configured. Falling back to placeholder config to keep app booting.');
        return {
            url: FALLBACK_SUPABASE_URL,
            anonKey: anonKey || FALLBACK_SUPABASE_ANON_KEY,
        };
    }

    return { url: url as string, anonKey: anonKey as string };
}
