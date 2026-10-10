import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
import { type ColorName, cssVariable, palette } from '@/theme/palette';

// Web only: the HTML shell around every pre-rendered page.

const declarations = (scheme: 'light' | 'dark') =>
  Object.entries(palette[scheme])
    .map(([name, value]) => `${cssVariable(name as ColorName)}:${value};`)
    .join('');

const themeCss = `
:root{${declarations('light')}color-scheme:light dark;}
@media (prefers-color-scheme: dark){:root{${declarations('dark')}}}
body{background-color:var(--color-background);}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content={palette.light.background} />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content={palette.dark.background} />
        <ScrollViewStyleReset />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static CSS built from our own palette */}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
