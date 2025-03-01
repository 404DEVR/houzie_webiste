'use client';

import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { Bell, CircleFadingArrowUp, LogOut, User, Menu } from 'lucide-react';
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
    <nav className='w-full bg-[#579AFF] text-white'>
      <div className='container max-w-full py-2 flex items-center justify-between px-4 sm:pl-6 sm:pr-16 rounded-full'>
        {/* Left side - User info or Sign up links */}
        <div className='flex items-center'>
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
                    <span className='text-white text-sm sm:text-base hidden sm:inline'>
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
                      onClick={() => router.push('/subscriptions')}
                      className='flex border-none justify-start items-center  space-x-2 hover:bg-gray-100 p-2 rounded'
                    >
                      <CircleFadingArrowUp size={18} />
                      <span>Upgrade Plan</span>
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
              <Link
                href='/broker'
                className='py-2 px-3 sm:px-4 text-sm sm:text-base rounded-full hover:bg-white hover:text-[#579AFF] transition-colors'
              >
                Post Property
              </Link>
            </>
          ) : (
            <div className='flex items-center space-x-2 sm:space-x-4'>
              <Link
                href='/signUp'
                className='py-2 px-3 sm:px-4 text-sm sm:text-base rounded-full hover:bg-white hover:text-[#579AFF] transition-colors'
              >
                Rent
              </Link>
              <Link
                href='/brokerSignUp'
                className='py-2 px-3 sm:px-4 text-sm sm:text-base rounded-full hover:bg-white hover:text-[#579AFF] transition-colors'
              >
                Post Property
              </Link>
            </div>
          )}
        </div>

        {/* Center - Logo */}
        <div onClick={() => router.push('/')} className='cursor-pointer'>
          <Image
            src='/svg/light-logo.svg'
            alt='Houzie Logo'
            width={100}
            height={33}
            priority
            className='w-24 sm:w-32'
          />
        </div>

        {/* Right side - Navigation links */}
        <div className='hidden sm:flex items-center space-x-4'>
          <Link
            href='/about'
            className='py-2 px-4 rounded-full hover:bg-white hover:text-[#579AFF] transition-colors'
          >
            About
          </Link>
          <Link
            href='/contact'
            className='py-2 px-4 rounded-full hover:bg-white hover:text-[#579AFF] transition-colors'
          >
            Contact
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className='sm:hidden'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className='h-6 w-6' />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='sm:hidden bg-[#579AFF] px-4 py-2'>
          <Link
            href='/about'
            className='block py-2 hover:bg-white hover:text-[#579AFF] transition-colors'
          >
            About
          </Link>
          <Link
            href='/contact'
            className='block py-2 hover:bg-white hover:text-[#579AFF] transition-colors'
          >
            Contact
          </Link>
          {auth && (
            <Link
              href='/broker'
              className='block py-2 hover:bg-white hover:text-[#579AFF] transition-colors'
            >
              Post Property
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarDetailsPage;
