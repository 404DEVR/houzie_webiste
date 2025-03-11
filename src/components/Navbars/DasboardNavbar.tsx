// 'use client';

// import axios from 'axios';
// import { deleteCookie } from 'cookies-next';
// import { BadgeInfo, Bell, Contact, LogOut, Menu } from 'lucide-react';
// import Image from 'next/image';
// import { usePathname, useRouter } from 'next/navigation';
// import React, { useEffect, useRef, useState } from 'react';

// import { useCustomToast } from '@/hooks/use-custom-toast';
// import useAuth from '@/hooks/useAuth';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';

// import { UserData } from '@/interfaces/Interface';

// const DasboardNavbar = () => {
//   const toast = useCustomToast();
//   const { auth, setAuth } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [opacity, setOpacity] = useState(1);
//   const navRef = useRef(null);

//   const isHomePage = pathname === '/';

//   const handleLogout = async () => {
//     try {
//       setAuth(null);
//       deleteCookie('auth');
//       toast.success({
//         title: 'Logged Out Successful',
//         description: 'You have been successfully logged out.',
//       });
//       router.push('/');
//     } catch (error) {
//       toast.error({
//         title: 'Log Out Failed',
//         description: 'An error occurred during Log Out. Please try again.',
//       });
//     }
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (auth?.userid) {
//         const response = await axios.get(`https://api.houzie.in/profile`, {
//           headers: {
//             Authorization: `Bearer ${auth.accessToken}`,
//           },
//         });
//         setUserData(response.data);
//       }
//     };
//     fetchUserData();
//   }, [auth]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const newOpacity = Math.max(1 - scrollPosition / 300, 0.9);
//       setOpacity(newOpacity);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollToSection = (sectionId) => {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <nav
//       ref={navRef}
//       style={{ backgroundColor: `rgba(114, 158, 255, ${opacity})` }}
//       className={`w-full text-black transition-colors duration-300 border-none ${
//         isHomePage ? 'sticky top-0 z-50' : ''
//       }`}
//     >
//       <div className='container max-w-full md:max-w-7xl py-2 flex items-center justify-between px-4 md:p-0 md:mx-auto rounded-full'>
//         <div className='flex items-center'>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Card className='bg-transparent border-none cursor-pointer rounded-[9px] overflow-hidden p-0'>
//                 <CardContent className='bg-transparent flex items-center justify-center p-0'>
//                   <Image
//                     src='/svg/account.svg'
//                     alt='public/svg/account.svg'
//                     width={40}
//                     height={40}
//                   />
//                 </CardContent>
//               </Card>
//             </PopoverTrigger>
//             <PopoverContent className='w-48 sm:w-56'>
//               <div className='flex flex-col space-y-1 sm:space-y-2'>
//                 <Button
//                   variant='outline'
//                   className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
//                 >
//                   <Bell size={16} />
//                   <span>Notifications</span>
//                 </Button>
//                 <Button
//                   variant='outline'
//                   onClick={handleLogout}
//                   className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-red-500 hover:text-red-500 text-sm sm:text-base'
//                 >
//                   <LogOut size={16} />
//                   <span>Logout</span>
//                 </Button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>

//         <div onClick={() => router.push('/')} className='cursor-pointer '>
//           <h1 className='text-3xl sm:text-4xl md:text-5xl pt-2 font-bold text-white'>
//             Houzie
//           </h1>
//         </div>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Card className='bg-transparent border-none cursor-pointer rounded-[9px] overflow-hidden  p-0'>
//               <CardContent className='bg-transparent flex items-center justify-center p-0'>
//                 <Image
//                   src='/svg/list.svg'
//                   alt='public/svg/list.svg'
//                   width={40}
//                   height={40}
//                 />
//               </CardContent>
//             </Card>
//           </PopoverTrigger>
//           <PopoverContent className='w-48 sm:w-56'>
//             <div className='flex flex-col space-y-1 sm:space-y-2'>
//               <Button
//                 variant='outline'
//                 className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
//               >
//                 <Bell size={16} />
//                 <span>Notifications</span>
//               </Button>
//               <Button
//                 variant='outline'
//                 // onClick={() => router.push('/subscriptions')}
//                 className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
//               >
//                 <BadgeInfo size={16} />
//                 <span>Support</span>
//               </Button>
//               <Button
//                 variant='outline'
//                 // onClick={() => router.push('/subscriptions')}
//                 className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-sm sm:text-base'
//               >
//                 <Contact size={16} />
//                 <span>Contact Us</span>
//               </Button>
//               <Button
//                 variant='outline'
//                 onClick={handleLogout}
//                 className='flex border-none justify-start items-center  space-x-1 sm:space-x-2 hover:bg-gray-100 p-1 sm:p-2 rounded text-red-500 hover:text-red-500 text-sm sm:text-base'
//               >
//                 <LogOut size={16} />
//                 <span>Logout</span>
//               </Button>
//             </div>
//           </PopoverContent>
//         </Popover>

//         <div className='sm:hidden'>
//           <Button
//             variant='ghost'
//             size='icon'
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <Menu className='h-5 w-5' />
//           </Button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default DasboardNavbar;

'use client';

import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { BadgeInfo, Bell, Contact, LogOut, Menu } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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

import type { UserData } from '@/interfaces/Interface';

const DashboardNavbar = () => {
  const toast = useCustomToast();
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [opacity, setOpacity] = useState(1);
  const navRef = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<'left' | 'right'>(
    'left'
  );
  const [popoverContent, setPopoverContent] = useState<'account' | 'menu'>(
    'account'
  );

  const isHomePage = pathname === '/';

  const handleLogout = async () => {
    try {
      setAuth(null);
      deleteCookie('auth');
      toast.success({
        title: 'Logged Out Successful',
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
        try {
          const response = await axios.get(`https://api.houzie.in/profile`, {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
          onClick={() => setIsPopoverOpen(false)}
        />
      )}

      <nav
        ref={navRef}
        style={{ backgroundColor: `rgba(114, 158, 255, ${opacity})` }}
        className={`w-full bg-black text-black transition-colors duration-300 h-16 border-none z-50 ${
          isHomePage ? 'sticky top-0' : ''
        }`}
      >
        <div className=' max-w-full md:w-[80%] h-full flex items-center justify-between px-4 md:p-0 md:mx-auto'>
          <div className='flex items-center'>
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
                <Card className='bg-transparent border-none cursor-pointer rounded-[9px] overflow-hidden p-0 relative z-50'>
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
              <PopoverContent
                className='w-auto shadow-[0_0_25px_rgba(255,255,255,0.8)] border-2 rounded-2xl border-white/20 z-50'
                align='start'
                sideOffset={20}
              >
                <div className='pt-8 px-2 bg-white rounded-lg'>
                  <div className='flex flex-col space-y-4'>
                    <div className='flex flex-col md:flex-row w-full gap-8'>
                      {/* User Details */}
                      <div className='col-span-1 flex flex-col gap-2 pb-8'>
                        <div className='flex flex-col gap-'>
                          <Label className='text-xs font-semibold'>Name</Label>
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
                          {/* {userData?.profilePicture ? (
                            <Image
                              src={
                                userData.profilePicture || '/placeholder.svg'
                              }
                              alt='Profile'
                              width={160}
                              height={160}
                              className='object-cover'
                            />
                          ) : (
                            <span className='text-2xl font-bold text-gray-500'>
                              {userData?.name?.charAt(0) || 'U'}
                            </span>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div onClick={() => router.push('/')} className='cursor-pointer'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl pt-2 font-semibold text-white font-poppins'>
              Houzie
            </h1>
          </div>

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
              <Card className='bg-transparent border-none cursor-pointer rounded-[9px] overflow-hidden p-0 relative z-50'>
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
            <PopoverContent
              className='w-80 shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-white/20 z-50'
              align='end'
              sideOffset={20}
            >
              <div className='p-0 bg-white rounded-lg'>
                <div className='flex flex-col space-y-1'>
                  <Button className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex justify-start items-center space-x-2 hover:bg-gray-100 p-0 rounded'>
                    <Bell size={16} />
                    <span>Notifications</span>
                  </Button>
                  <Button className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex justify-start items-center space-x-2 hover:bg-gray-100 p-0 rounded'>
                    <BadgeInfo size={16} />
                    <span>Support</span>
                  </Button>
                  <Button className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex justify-start items-center space-x-2 hover:bg-gray-100 p-0 rounded'>
                    <Contact size={16} />
                    <span>Contact Us</span>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className='focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex justify-start items-center space-x-2 hover:bg-gray-100 rounded p-0 text-red-500 hover:text-red-500'
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
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
      </nav>
    </>
  );
};

export default DashboardNavbar;
