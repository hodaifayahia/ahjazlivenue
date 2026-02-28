'use client';

import { LanguageProvider } from './LanguageProvider';
import EmojiProvider from './EmojiProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <EmojiProvider />
            {children}
        </LanguageProvider>
    );
}
