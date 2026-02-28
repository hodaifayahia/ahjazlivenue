import { createClient } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

const handleI18n = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if path is a protected route (dashboard/admin only)
    const isProtectedRoute = routing.locales.some(loc =>
        pathname.startsWith(`/${loc}/dashboard`) ||
        pathname.startsWith(`/${loc}/admin`)
    ) || pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

    // Check if it's an auth page
    const isAuthPage = routing.locales.some(loc =>
        pathname === `/${loc}/login` ||
        pathname === `/${loc}/register`
    ) || pathname === '/login' || pathname === '/register';

    // For public routes (salles, homepage, etc.) — just run i18n, NO Supabase at all
    if (!isProtectedRoute && !isAuthPage) {
        return handleI18n(request);
    }

    // Only create Supabase client for protected/auth routes
    const { supabase, response } = createClient(request);

    // Use getSession() instead of getUser() — reads cookie locally, instant, no network call
    const { data: { session } } = await supabase.auth.getSession();

    if (!session && isProtectedRoute) {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/login`;
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users from login/register to dashboard
    if (session && isAuthPage) {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/dashboard`;
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

export const config = {
    matcher: [
        '/',
        '/(fr|en|ar)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
