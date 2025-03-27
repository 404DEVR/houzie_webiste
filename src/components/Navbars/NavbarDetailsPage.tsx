'use client';

import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { UserData } from '@/interfaces/Interface';
import { NavbarDetailsPageProps } from '@/interfaces/PropsInterface';

const NavbarDetailsPage = ({ stickyPage }: NavbarDetailsPageProps) => {
  const toast = useCustomToast();
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [opacity, setOpacity] = useState(1);
  const navRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showNavbarBackground, setShowNavbarBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newOpacity = Math.max(1 - scrollPosition / 100, 2);
      setOpacity(newOpacity);

      if (stickyPage === 'home' && scrollPosition > 100) {
        setShowNavbarBackground(true);
      } else {
        setShowNavbarBackground(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyPage]);

  const handleLogout = async () => {
    try {
      setAuth(null);
      setIsPopoverOpen(false);
      deleteCookie('auth');
      toast.success({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error) {
      toast.error({
        title: 'Log Out Failed',
        description: 'An error occurred during Log Out. Please try again.',
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

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<'left' | 'right'>(
    'left'
  );
  const [popoverContent, setPopoverContent] = useState<'account' | 'menu'>(
    'account'
  );
  const handlePopoverOpenChange = (
    open: boolean,
    content: 'account' | 'menu',
    position: 'left' | 'right'
  ) => {
    setIsPopoverOpen(open);
    if (open) {
      setPopoverContent(content);
      setPopoverPosition(position);
    }
  };

  return (
    <>
      {isPopoverOpen && (
        <div
          className=' fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
          onClick={() => setIsPopoverOpen(false)}
        />
      )}
      <nav
        ref={navRef}
        className={`${
          stickyPage === 'home' && showNavbarBackground
            ? 'bg-[#3b8ff6] shadow-md'
            : 'bg-none'
        } w-full h-[8.5vh]  text-black transition-colors bg-none duration-300 border-none z-50 ${
          stickyPage === 'home' ? 'fixed top-0' : ''
        }`}
      >
        <div className='max-w-full h-full flex items-center justify-between px-4 md:p-0 md:mx-auto'>
          <div className='md:flex items-center justify-start w-1/3 hidden h-full px-4'>
            {auth ? (
              <>
                <Popover
                  open={
                    isPopoverOpen &&
                    popoverContent === 'account' &&
                    popoverPosition === 'left'
                  }
                  onOpenChange={(open) =>
                    handlePopoverOpenChange(open, 'account', 'left')
                  }
                >
                  <PopoverTrigger asChild>
                    <div
                      className={`flex cursor-pointer items-center gap-3 px-1 py-1 rounded-xl border ${
                        stickyPage !== 'home'
                          ? 'text-[#3b8ff6] border-[#3b8ff6]'
                          : 'text-white border-white'
                      }`}
                    >
                      <div className='w-10 h-10 relative rounded-full overflow-hidden flex items-center justify-center'>
                        <Image
                          src='/images/Dummy profile.png'
                          alt='Profile'
                          fill
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <span
                        className={` text-base gap-2 flex justify-between items-center`}
                      >
                        {userData?.name || 'John Doe'}
                        <ChevronDown className='w-5 h-5' />
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto shadow-[0_0_25px_rgba(255,255,255,0.8)] border-2 rounded-2xl border-white/20 z-50'
                    align='start'
                    sideOffset={20}
                  >
                    <div
                      onClick={() => router.push('/profile?section=profile')}
                      className='pt-8 px-2  rounded-lg cursor-pointer'
                    >
                      <div className='flex flex-col space-y-4'>
                        <div className='flex flex-col md:flex-row w-full gap-8'>
                          {/* User Details */}
                          <div className='col-span-1 flex flex-col gap-2 pb-8'>
                            <div className='flex flex-col gap-'>
                              <Label className='text-xs font-semibold'>
                                Name
                              </Label>
                              <h3 className='border-none ml-4 h-8 bg-transparent text-[#646464] w-full text-xl font-bold pt-0'>
                                {userData?.name || 'No Name'}
                              </h3>
                            </div>
                            <div className='flex flex-col gap-0'>
                              <Label className='text-xs font-semibold'>
                                Email Address
                              </Label>

                              <h3 className='border-none ml-4 h-8 bg-transparent text-[#646464] w-full text-xl font-bold pt-0'>
                                {userData?.email || 'No Email'}
                              </h3>
                            </div>
                            <div className='flex flex-col gap-0'>
                              <Label className='text-xs font-semibold'>
                                Phone Number
                              </Label>

                              <h3 className='border-none ml-4 h-8 bg-transparent text-[#646464] w-full text-xl font-bold pt-0'>
                                {userData?.phoneNumber || 'No Phone Number'}
                              </h3>
                            </div>

                            <div className='flex flex-col gap-0'>
                              <Label className='text-xs font-semibold'>
                                Company Name
                              </Label>

                              <h3 className='border-none ml-4 h-8 bg-transparent text-[#646464] w-full text-xl font-bold pt-0'>
                                {userData?.companyName || 'No Company Name'}
                              </h3>
                            </div>
                          </div>
                          {/* Avatar with Camera Icon */}
                          <div className='flex flex-col justify-between items-center col-span-1 h-full'>
                            <div className='relative h-40 w-40'>
                              <Image
                                src='/images/Dummy profile.png'
                                alt='Avatar'
                                width={160}
                                priority
                                height={160}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <div className='flex items-center space-x-1 sm:space-x-2'>
                <div
                  onClick={() => {
                    router.push('/');
                  }}
                  className={`${
                    stickyPage === 'home'
                      ? 'text-white hover:bg-white hover:text-[#579AFF]'
                      : 'text-[#579AFF] hover:bg-[#579AFF] hover:text-white'
                  } cursor-pointer  py-1 px-2 text-sm sm:text-xl rounded-full  transition-colors`}
                >
                  About
                </div>
                <div
                  onClick={() => {
                    router.push('/');
                  }}
                  className={`${
                    stickyPage === 'home'
                      ? 'text-white hover:bg-white hover:text-[#579AFF]'
                      : 'text-[#579AFF] hover:bg-[#579AFF] hover:text-white'
                  } cursor-pointer py-1 px-2 sm:px-3 text-sm sm:text-xl rounded-full  transition-colors`}
                >
                  Concept
                </div>
              </div>
            )}
          </div>
          <div
            onClick={() => router.push('/')}
            className='cursor-pointer w-1/3 flex justify-center relative'
          >
            {stickyPage === 'home' ? (
              <Image
                src='/svg/houzie light.svg'
                alt='Houzie Logo'
                width={110}
                height={110}
                className='relative md:-bottom-1'
              />
            ) : (
              <Image
                src='/svg/houzie dark.svg'
                alt='Houzie Logo'
                width={110}
                height={110}
                className='relative md:-bottom-1'
              />
            )}

            {/* <h1 className='text-3xl sm:text-4xl md:text-5xl md:pt-4 font-bold text-white'>
              Houzie
            </h1> */}
          </div>

          <div className='w-1/3 flex justify-end items-end px-4'>
            {auth?.accessToken ? (
              <Popover
                open={
                  isPopoverOpen &&
                  popoverContent === 'menu' &&
                  popoverPosition === 'right'
                }
                onOpenChange={(open) =>
                  handlePopoverOpenChange(open, 'menu', 'right')
                }
              >
                <PopoverTrigger asChild>
                  <Card className=' bg-transparent border-none cursor-pointer rounded-[9px] overflow-hidden p-0 relative z-50'>
                    <CardContent className='bg-transparent flex items-center justify-center p-0'>
                      {stickyPage === 'home' ? (
                        <Image
                          src='/svg/list light.svg'
                          alt='public/svg/list.svg'
                          width={40}
                          height={40}
                        />
                      ) : (
                        <Image
                          src='/svg/list.svg'
                          alt='public/svg/list.svg'
                          width={40}
                          height={40}
                        />
                      )}
                    </CardContent>
                  </Card>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-white/20 z-50'
                  align='end'
                  sideOffset={20}
                >
                  <div className='p-0 rounded-lg'>
                    <div className='flex flex-col space-y-2 px-4'>
                      <Button
                        size='custom'
                        onClick={() => router.push('/profile?section=profile')}
                        className='focus-visible:border-0 border-b rounded-none py-1 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 '
                      >
                        <span>Profile</span>
                      </Button>
                      <Button
                        size='custom'
                        onClick={() =>
                          router.push('/profile?section=savedsearch')
                        }
                        className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                      >
                        <span>Saved Search</span>
                      </Button>
                      <Button
                        size='custom'
                        onClick={() =>
                          router.push('/profile?section=favorites')
                        }
                        className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2  border-b rounded-none py-1'
                      >
                        <span>Favorites</span>
                      </Button>
                      <Button
                        size='custom'
                        className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                      >
                        <span>Contacted</span>
                      </Button>
                      <Button
                        size='custom'
                        onClick={() => router.push('/profile?section=settings')}
                        className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                      >
                        <span>Settings</span>
                      </Button>
                      <Button
                        size='custom'
                        className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                      >
                        <span>Notifications</span>
                      </Button>
                      <Button
                        size='custom'
                        onClick={handleLogout}
                        className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2  border-b rounded-none py-1 text-red-500 hover:text-red-500'
                      >
                        <span>Logout</span>
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Popover
                  open={
                    isPopoverOpen &&
                    popoverContent === 'menu' &&
                    popoverPosition === 'right'
                  }
                  onOpenChange={(open) =>
                    handlePopoverOpenChange(open, 'menu', 'right')
                  }
                >
                  <PopoverTrigger asChild>
                    <Card className='md:hidden bg-transparent border-none cursor-pointer rounded-[9px] overflow-hidden p-0 relative z-50'>
                      <CardContent className='bg-transparent flex items-center justify-center p-0'>
                        {stickyPage === 'home' ? (
                          <Image
                            src='/svg/list light.svg'
                            alt='public/svg/list.svg'
                            width={40}
                            height={40}
                          />
                        ) : (
                          <Image
                            src='/svg/list.svg'
                            alt='public/svg/list.svg'
                            width={40}
                            height={40}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-white/20 z-50'
                    align='end'
                    sideOffset={20}
                  >
                    <div className='p-0 rounded-lg'>
                      <div className='flex flex-col space-y-2 px-4'>
                        <Button
                          size='custom'
                          onClick={() =>
                            router.push('/profile?section=profile')
                          }
                          className='focus-visible:border-0 border-b rounded-none py-1 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 '
                        >
                          <span>Profile</span>
                        </Button>
                        <Button
                          size='custom'
                          onClick={() =>
                            router.push('/profile?section=savedsearch')
                          }
                          className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                        >
                          <span>Saved Search</span>
                        </Button>
                        <Button
                          size='custom'
                          onClick={() =>
                            router.push('/profile?section=favorites')
                          }
                          className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2  border-b rounded-none py-1'
                        >
                          <span>Favorites</span>
                        </Button>
                        <Button
                          size='custom'
                          className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                        >
                          <span>Contacted</span>
                        </Button>
                        <Button
                          size='custom'
                          onClick={() =>
                            router.push('/profile?section=settings')
                          }
                          className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                        >
                          <span>Settings</span>
                        </Button>
                        <Button
                          size='custom'
                          className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2 border-b rounded-none py-1'
                        >
                          <span>Notifications</span>
                        </Button>
                        <Button
                          size='custom'
                          onClick={handleLogout}
                          className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-32 flex justify-start items-center space-x-2  border-b rounded-none py-1 text-red-500 hover:text-red-500'
                        >
                          <span>Logout</span>
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className='md:block hidden'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <div
                      onClick={() => {
                        router.push('/brokerSignUp');
                      }}
                      className={`${
                        stickyPage === 'home'
                          ? 'text-white hover:bg-white hover:text-[#579AFF]'
                          : 'text-[#579AFF] hover:bg-[#579AFF] hover:text-white'
                      } cursor-pointer py-1 px-2 sm:px-3 text-sm sm:text-xl rounded-full  transition-colors`}
                    >
                      Post Property
                    </div>
                    <div
                      onClick={() => {
                        router.push('/');
                      }}
                      className={`${
                        stickyPage === 'home'
                          ? 'text-white hover:bg-white hover:text-[#579AFF]'
                          : 'text-[#579AFF] hover:bg-[#579AFF] hover:text-white'
                      } cursor-pointer py-1 px-2 sm:px-3 text-sm sm:text-xl rounded-full  transition-colors`}
                    >
                      Contact
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarDetailsPage;
