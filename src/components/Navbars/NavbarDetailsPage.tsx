'use client';

import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { Bell, LogOut, User } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { UserData } from '@/interfaces/Interface';

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
      window.location.reload();
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
        const response = await axios.get(`https://api.houzie.in/profile`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setUserData(response.data);
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
            priority
            className='w-6 h-6 sm:w-7 sm:h-7'
          />
          <span className='font-medium text-white text-xl sm:text-2xl md:text-[32px] leading-tight sm:leading-[48px] font-sans'>
            Houzie
          </span>
        </div>

        <button
          className='md:hidden text-white'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className='hidden md:flex items-center space-x-4'>
          {auth ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <div className='flex items-center gap-2 px-3 py-1 sm:px-5 sm:py-2 rounded-xl cursor-pointer'>
                    <Card className='w-8 h-8 sm:w-[42px] sm:h-10 bg-white rounded-[9px] overflow-hidden'>
                      <CardContent className='p-1 sm:p-2 flex items-center justify-center'>
                        <User className='w-5 h-5 sm:w-6 sm:h-6 text-[#42A4AE]' />
                      </CardContent>
                    </Card>
                    <span className='text-white text-sm sm:text-base'>
                      {userData?.name}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className='w-56'>
                  <div className='flex flex-col space-y-2'>
                    <Button
                      onClick={() => router.push('/profile')}
                      variant='outline'
                      className='flex border-none justify-start items-center text-start space-x-2 hover:bg-gray-100 p-2 rounded'
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Button>
                    <Button
                      variant='outline'
                      className='flex border-none justify-start items-center  space-x-2 hover:bg-gray-100 p-2 rounded'
                    >
                      <Bell size={18} />
                      <span>Notifications</span>
                    </Button>
                    <Button
                      variant='outline'
                      onClick={handleLogout}
                      className='flex border-none justify-start items-center  space-x-2 hover:bg-gray-100 p-2 rounded text-red-500 hover:text-red-500'
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant='outline'
                asChild
                className='bg-transparent border-white text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
              >
                <Link href='/broker'>Post Properties on Houzie</Link>
              </Button>
              <Button
                asChild
                className='bg-white text-[#42A4AE] hover:bg-opacity-90 transition-colors'
              >
                <Link href='/subscriptions'>Upgrade Plan</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                asChild
                className='bg-transparent border-white text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
              >
                <Link href='/brokerSignUp'>Post Properties on Houzie</Link>
              </Button>
              <Button
                asChild
                className='bg-white text-[#42A4AE] hover:bg-opacity-90 transition-colors'
              >
                <Link href='/signUp'>Explore Properties on Houzie</Link>
              </Button>
            </>
          )}
        </div>
      </div>

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
                <span className='text-white text-sm'>{userData?.name}</span>
              </div>
              <Link
                href='/broker'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Post Properties on Houzie
              </Link>
              <button
                onClick={handleLogout}
                className='block w-full text-left px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Logout
              </button>
              <Link
                href='/subscriptions'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Upgrade Plan
              </Link>
            </>
          ) : (
            <>
              <Link
                href='/brokerSignUp'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Post Properties on Houzie
              </Link>
              <Link
                href='/signUp'
                className='block px-4 py-2 text-white hover:bg-[#3a939c]'
              >
                Explore Properties on Houzie
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarDetailsPage;
