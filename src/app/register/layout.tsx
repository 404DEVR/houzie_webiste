import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Register',
  description: 'register and find out',
};

export default function LoginsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
