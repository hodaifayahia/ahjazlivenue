import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig } from '@/lib/supabase/env';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
    const forwardedOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : '';
    const requestOrigin = new URL(request.url).origin;
    const appOrigin = forwardedOrigin || requestOrigin || configuredOrigin || 'https://app.ahjazliqaati.com';
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';
    const safeNext = next.startsWith('/') ? next : '/dashboard';

    const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseConfig();

    const successRedirect = NextResponse.redirect(`${appOrigin}${safeNext}`);

    if (!code) {
        return NextResponse.redirect(`${appOrigin}/login?error=auth_callback_error`);
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        successRedirect.cookies.set(name, value, options);
                    });
                },
            },
        },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
        return successRedirect;
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${appOrigin}/login?error=auth_callback_error`);
}
