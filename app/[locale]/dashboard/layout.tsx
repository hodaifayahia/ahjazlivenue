import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from './DashboardLayout';
import NavigationProgress from '@/components/NavigationProgress';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Use getSession() for fast local check (reads cookie, no network call)
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        redirect('/login');
    }

    const user = session.user;

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <>
            <NavigationProgress />
            <DashboardLayout
                user={user}
                profile={profile}
                subscription={null}
            >
                {children}
            </DashboardLayout>
        </>
    );
}
