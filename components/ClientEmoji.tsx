'use client';

import NativeEmoji from '@/components/NativeEmoji';
import { ComponentProps } from 'react';

type EmojiProps = ComponentProps<typeof NativeEmoji>;

export default function ClientEmoji(props: EmojiProps) {
    return <NativeEmoji {...props} />;
}
