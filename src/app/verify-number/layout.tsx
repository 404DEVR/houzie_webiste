import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Login',
  description: 'cmon login',
};

export default function LoginsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
