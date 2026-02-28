import { createClient } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export async function middleware(request: NextRequest) {
    const handleI18n = createMiddleware(routing);

    // Check if path contains /dashboard or /admin (protected routes)
    // Note: /salles is now public — no auth needed for browsing venues
    const isProtectedRoute = routing.locales.some(loc =>
        request.nextUrl.pathname.startsWith(`/${loc}/dashboard`) ||
        request.nextUrl.pathname.startsWith(`/${loc}/admin`)
    ) || request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/admin');

    // Check if it's an auth page
    const isAuthPage = routing.locales.some(loc =>
        request.nextUrl.pathname === `/${loc}/login` ||
        request.nextUrl.pathname === `/${loc}/register`
    ) || request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

    // ONLY check auth if we're on a protected route or auth page
    if (isProtectedRoute || isAuthPage) {
        const { supabase, response } = createClient(request);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user && isProtectedRoute) {
            // Redirect to login (maintaining locale if present, or defaulting)
            const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
            const url = request.nextUrl.clone();
            url.pathname = `/${locale}/login`;
            url.searchParams.set('redirectTo', request.nextUrl.pathname);
            return NextResponse.redirect(url);
        }

        // Redirect authenticated users from login/register to dashboard
        if (user && isAuthPage) {
            const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';

            // Check if user is admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const url = request.nextUrl.clone();
            // Redirect admins to /admin, others to /dashboard
            url.pathname = profile?.role === 'admin'
                ? `/${locale}/admin`
                : `/${locale}/dashboard`;
            return NextResponse.redirect(url);
        }

        // Run i18n middleware and merge Supabase cookies
        const i18nResponse = handleI18n(request);
        const supabaseCookies = response.cookies.getAll();
        supabaseCookies.forEach((cookie) => {
            i18nResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return i18nResponse;
    }

    // For public routes (including /salles), just run i18n middleware (no Supabase call)
    return handleI18n(request);
}

export const config = {
    matcher: [
        '/',
        '/(fr|en|ar)/:path*',
        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
