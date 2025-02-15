'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className='border-b'>
      <div className='flex h-16 items-center px-4 container mx-auto'>
        {/* Logo */}
        <Link href='/' className='mr-6 flex items-center space-x-2'>
          <span className='font-bold text-xl'>Logo</span>
        </Link>

        {/* Auth buttons */}
        <div className='ml-auto flex items-center space-x-4'>
          {session?.user ? (
            <UserMenu
              user={
                session?.user as { email: string; image?: string | undefined }
              }
            />
          ) : (
            <>
              <Button variant='ghost' asChild>
                <Link href='/login'>Login</Link>
              </Button>
              <Button asChild>
                <Link href='/register'>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
