import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppProviders from '@/components/AppProviders';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AppProviders>
            <Header />
            <main className="min-h-screen pt-16 sm:pt-20">
                {children}
            </main>
            <Footer />
        </AppProviders>
    );
}
