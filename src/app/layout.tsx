import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OpenClaw Mission Control',
  description:
    'Open-source dashboard for monitoring and managing AI agents on Clawdbot/OpenClaw',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
