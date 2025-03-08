'use client';

import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import {
  AlignRight,
  BadgeInfo,
  Bell,
  CircleFadingArrowUp,
  Contact,
  List,
  LogOut,
  Menu,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

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
import { FcAbout } from 'react-icons/fc';
import Image from 'next/image';

const DasboardNavbar = () => {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [opacity, setOpacity] = useState(1);
  const navRef = useRef(null);

  const isHomePage = pathname === '/';

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newOpacity = Math.max(1 - scrollPosition / 300, 0.9);
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      style={{ backgroundColor: `rgba(114, 158, 255, ${opacity})` }}
      className={`w-full text-black transition-colors duration-300 border-none ${
        isHomePage ? 'sticky top-0 z-50' : ''
      }`}
    >
      <div className='container max-w-full py-2 flex items-center justify-between px-4 sm:px-20 rounded-full'>
        <div className='flex items-center'>
          <Popover>
            <PopoverTrigger asChild>
              <Card className='bg-transparent border-none  rounded-[9px] overflow-hidden p-0'>
                <CardContent className='bg-transparent flex items-center justify-center p-0'>
                  <Image
                    src='/svg/account.svg'
                    alt='public/svg/account.svg'
                    width={40}
                    height={40}
                  />
                </CardContent>
              </Card>
            </PopoverTrigger>
            <PopoverContent className='w-48 sm:w-56'>
              <div className='flex flex-col space-y-1 sm:space-y-2'>
                <Button
                  variant='outline'
                  className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
                >
                  <Bell size={16} />
                  <span>Notifications</span>
                </Button>
                <Button
                  variant='outline'
                  onClick={handleLogout}
                  className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-red-500 hover:text-red-500 text-sm sm:text-base'
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div onClick={() => router.push('/')} className='cursor-pointer '>
          <h1 className='text-3xl sm:text-4xl md:text-5xl pt-2 font-bold text-white'>
            Houzie
          </h1>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Card className='bg-transparent border-none  rounded-[9px] overflow-hidden  p-0'>
              <CardContent className='bg-transparent flex items-center justify-center p-0'>
                <Image
                  src='/svg/list.svg'
                  alt='public/svg/list.svg'
                  width={40}
                  height={40}
                />
              </CardContent>
            </Card>
          </PopoverTrigger>
          <PopoverContent className='w-48 sm:w-56'>
            <div className='flex flex-col space-y-1 sm:space-y-2'>
              <Button
                variant='outline'
                className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
              >
                <Bell size={16} />
                <span>Notifications</span>
              </Button>
              <Button
                variant='outline'
                // onClick={() => router.push('/subscriptions')}
                className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
              >
                <BadgeInfo size={16} />
                <span>Support</span>
              </Button>
              <Button
                variant='outline'
                // onClick={() => router.push('/subscriptions')}
                className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
              >
                <Contact size={16} />
                <span>Contact Us</span>
              </Button>
              <Button
                variant='outline'
                onClick={handleLogout}
                className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-red-500 hover:text-red-500 text-sm sm:text-base'
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className='sm:hidden'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className='h-5 w-5' />
          </Button>
        </div>
      </div>

      {/* {isMenuOpen && (
        <div className='sm:hidden bg-[#579AFF] px-4 py-3'>
          {!auth?.accessToken ? (
            <Link
              href='/brokerSignUp'
              className='block py-2 text-sm hover:bg-white hover:text-[#579AFF] transition-colors rounded-lg'
            >
              Post Properties
            </Link>
          ) : (
            <>
              <div
                onClick={() => scrollToSection('hero')}
                className='block py-2 text-sm hover:bg-white hover:text-[#579AFF] transition-colors rounded-lg  '
              >
                Rent
              </div>
              <Link
                href='/broker'
                className='block py-2 text-sm hover:bg-white hover:text-[#579AFF] transition-colors rounded-lg'
              >
                Post Property
              </Link>
            </>
          )}
          <Link
            href='/about'
            className='block py-2 text-sm hover:bg-white hover:text-[#579AFF] transition-colors'
          >
            About
          </Link>
        </div>
      )} */}
    </nav>
  );
};

export default DasboardNavbar;
