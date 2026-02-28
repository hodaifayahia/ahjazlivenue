'use client';

import { EmojiProvider as ReactAppleEmojiProvider } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';
import { LanguageProvider } from './LanguageProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ReactAppleEmojiProvider data={emojiData}>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </ReactAppleEmojiProvider>
    );
}
