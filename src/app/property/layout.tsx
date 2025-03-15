import { Metadata } from 'next';
import * as React from 'react';

import Footer from '@/components/Footer';
import NavbarDetailsPage from '@/components/Navbars/NavbarDetailsPage';

export const metadata: Metadata = {
  title: 'Details',
  description: 'Details Page',
};

export default function LoginsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarDetailsPage />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
}
