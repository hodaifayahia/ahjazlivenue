import localFont from 'next/font/local';

export const arabicFont = localFont({
    src: [
        { path: '../../landing-page/arabic-font/arabic-ui-display-thin.ttf', weight: '100' },
        { path: '../../landing-page/arabic-font/arabic-ui-display-ultralight.ttf', weight: '200' },
        { path: '../../landing-page/arabic-font/arabic-ui-display-light.ttf', weight: '300' },
        { path: '../../landing-page/arabic-font/arabic-ui-display.ttf', weight: '400' },
        { path: '../../landing-page/arabic-font/arabic-ui-display-medium.ttf', weight: '500' },
        { path: '../../landing-page/arabic-font/arabic-ui-display-semibold.ttf', weight: '600' },
        { path: '../../landing-page/arabic-font/arabic-ui-display-bold.ttf', weight: '700' },
        { path: '../../landing-page/arabic-font/arabic-ui-display-heavy.ttf', weight: '800' },
        { path: '../../landing-page/arabic-font/arabic-ui-display-black.ttf', weight: '900' },
    ],
    variable: '--font-arabic',
});
