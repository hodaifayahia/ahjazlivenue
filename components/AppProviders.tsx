'use client';

import { LanguageProvider } from './LanguageProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            {children}
        </LanguageProvider>
    );
}
