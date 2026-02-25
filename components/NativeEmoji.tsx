'use client';

type NativeEmojiProps = {
    name: string;
    width?: number;
    className?: string;
};

const emojiByName: Record<string, string> = {
    'party-popper': '🎉',
    'magnifying-glass-tilted-left': '🔎',
    'telephone-receiver': '📞',
    'round-pushpin': '📍',
    'camera-with-flash': '📸',
    'free-button': '🆓',
    'high-voltage': '⚡',
    memo: '📝',
    'classical-building': '🏛️',
    'chart-increasing': '📈',
    loudspeaker: '📢',
    'money-bag': '💰',
    'bar-chart': '📊',
    wedding: '💒',
    'office-building': '🏢',
    'deciduous-tree': '🌳',
    'house-with-garden': '🏡',
    hotel: '🏨',
    'fork-and-knife-with-plate': '🍽️',
    'night-with-stars': '🌃',
    envelope: '✉️',
    'framed-picture': '🖼️',
};

export default function NativeEmoji({ name, width = 20, className }: NativeEmojiProps) {
    const emoji = emojiByName[name] || '✨';

    return (
        <span
            aria-hidden="true"
            className={className}
            style={{ display: 'inline-block', fontSize: width, lineHeight: 1 }}
            title={name}
        >
            {emoji}
        </span>
    );
}
