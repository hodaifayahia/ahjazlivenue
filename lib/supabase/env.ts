const looksLikeHttpUrl = (value: string) =>
    value.startsWith('http://') || value.startsWith('https://');

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
