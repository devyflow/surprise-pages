import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const display = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Surprise Pages — Turn a gift into a moment',
  description: 'Create a personalised one-page surprise with photos, memories, music or a countdown, then send it as one private link.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink antialiased font-body">{children}</body>
    </html>
  );
}
