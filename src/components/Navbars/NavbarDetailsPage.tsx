'use client';

import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { User } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UserData {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  role: string;
  aadharNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

const NavbarDetailsPage = () => {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogout = async () => {
    try {
      setAuth(null);
      deleteCookie('auth');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Log Out Failed',
        description: 'An error occurred during Log Out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth?.userid) {
        try {
          const response = await axios.get(`https://api.houzie.in/profile`, {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
          setUserData(response.data);
        } catch (error) {
          toast({
            title: 'Failed to fetch user data',
            description: 'Please try again later.',
            variant: 'destructive',
          });
        }
      }
    };

    fetchUserData();
  }, [auth]);

  return (
    <nav className='w-full bg-[#42A4AE] px-4 sm:px-6'>
      <div className='container max-w-full py-4 flex items-center justify-between'>
        <div
          onClick={() => router.push('/')}
          className='flex items-center gap-1 sm:gap-1.5 p-0.5 cursor-pointer'
        >
          <Image
            src='/svg/logo-house.svg'
            alt='Houzie Logo'
            width={24}
            height={24}
            className='w-6 h-6 sm:w-7 sm:h-7'
          />
          <span className='font-medium text-white text-xl sm:text-2xl md:text-[32px] leading-tight sm:leading-[48px] font-sans'>
            Houzie
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          className='md:hidden text-white'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className='hidden md:flex items-center space-x-4'>
          {auth ? (
            <>
              <div className='flex items-center gap-2 px-3 py-1 sm:px-5 sm:py-2 rounded-xl'>
                <Card className='w-8 h-8 sm:w-[42px] sm:h-10 bg-white rounded-[9px] overflow-hidden'>
                  <CardContent className='p-1 sm:p-2 flex items-center justify-center'>
                    <User className='w-5 h-5 sm:w-6 sm:h-6 text-[#42A4AE]' />
                  </CardContent>
                </Card>
                <span className='text-white text-sm sm:text-base'>
                  {userData?.name}
                </span>
              </div>
              <Button
                variant='outline'
                asChild
                className='bg-transparent border-white text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
              >
                <Link href='/broker'>Add Listing</Link>
              </Button>
              <Button
                onClick={handleLogout}
                variant='outline'
                className='bg-transparent border-white text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                asChild
                className='bg-transparent border-white text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
              >
                <Link href='/login'>Login</Link>
              </Button>
              <Button
                variant='outline'
                asChild
                className='bg-transparent border-white text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
              >
                <Link href='/login'>Add Listing</Link>
              </Button>
              <Button
                asChild
                className='bg-white text-[#42A4AE] hover:bg-opacity-90 transition-colors'
              >
                <Link href='/signUp'>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-[#42A4AE] py-4'>
          {auth ? (
            <>
              <div className='flex items-center gap-2 px-4 py-2'>
                <Card className='w-8 h-8 bg-white rounded-[9px] overflow-hidden'>
                  <CardContent className='p-1 flex items-center justify-center'>
                    <User className='w-5 h-5 text-[#42A4AE]' />
                  </CardContent>
                </Card>
                <span className='text-white text-sm'>{auth?.email}</span>
              </div>
              <Link
                href='/broker'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Add Listing
              </Link>
              <button
                onClick={handleLogout}
                className='block w-full text-left px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href='/login'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Login
              </Link>
              <Link
                href='/broker'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Add Listing
              </Link>
              <Link
                href='/signUp'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarDetailsPage;
