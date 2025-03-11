import { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import * as React from 'react';

import '@/styles/globals.css';

import { AuthProviders } from '@/lib/context/AuthProvider';

import Providers from '@/components/Providers';
import { ThemeProvider } from '@/components/theme/theme-provider';

import { siteConfig } from '@/constant/config';
import { ToastProvider } from '@/hooks/use-custom-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

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
    <html lang='en' className={poppins.variable}>
      <body>
        <ToastProvider>
          <AuthProviders>
            <Providers>
              <ThemeProvider
                attribute='class'
                defaultTheme='light'
                enableSystem
              >
                {children}
              </ThemeProvider>
            </Providers>
          </AuthProviders>
        </ToastProvider>
      </body>
    </html>
  );
}
