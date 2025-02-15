import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';

import { AuthProviders } from '@/lib/context/AuthProvider';

import Providers from '@/components/Providers';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import { siteConfig } from '@/constant/config';

// !STARTERCONF Change these default meta
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  authors: [
    {
      name: 'Nilay Nath Sharan',
      url: 'https://www.nilaysharan.in/',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProviders>
          <Providers>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </Providers>
          </AuthProviders>
      </body>
    </html>
  );
}
