import { Metadata } from 'next';
import * as React from 'react';

import { FilterProvider } from '@/lib/context/FilterContext';

import Footer from '@/components/Footer';
import DasboardNavbar from '@/components/Navbars/DasboardNavbar';

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
    <FilterProvider>
      <div className='flex flex-col min-h-screen'>
        <DasboardNavbar />
        <main className='flex-grow'>{children}</main>
        <Footer />
      </div>
    </FilterProvider>
  );
}
