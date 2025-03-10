import axios from 'axios';
import { Camera, ChevronRight, Edit } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import ExplorePlans from '@/components/Subscription/ExplorePlans';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ProfileFormInterface } from '@/interfaces/PropsInterface';

interface originalData {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
}

const ProfileForm = ({ page }: ProfileFormInterface) => {
  const toast = useCustomToast();
  const { auth } = useAuth();
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [originalData, setOriginalData] = useState<originalData>({
    name: '',
    email: '',
    phoneNumber: '',
    companyName: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showExplorePlans, setShowExplorePlans] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://api.houzie.in/profile`, {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        });
        setFullName(response.data.name ? response.data.name : '');
        setEmailAddress(response.data.email ? response.data.email : '');
        setPhoneNumber(
          response.data.phoneNumber ? response.data.phoneNumber : ''
        );
        setCompanyName(
          response.data.companyName ? response.data.companyName : ''
        );
        setOriginalData({
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          companyName: response.data.companyName || '',
        });
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [auth?.userid, auth?.accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: fullName,
      companyName: companyName,
    };

    try {
      const response = await axios.patch(
        `https://api.houzie.in/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        }
      );
      if (response.data) {
        const updatedProfile = response.data;
        setFullName(updatedProfile.name);
        setEmailAddress(updatedProfile.email);
        setPhoneNumber(updatedProfile.phoneNumber);
        setCompanyName(updatedProfile.companyName);
        setOriginalData({
          name: updatedProfile.name,
          email: updatedProfile.email,
          phoneNumber: updatedProfile.phoneNumber,
          companyName: updatedProfile.companyName,
        });
      }
      toast.success({
        title: 'Success!',
        description: 'Profile updated successfully.',
      });
    } catch (error) {
      toast.error({
        title: 'Failed to Update',
        description: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleExplorePlansClick = () => {
    setShowExplorePlans(true);
  };

  const hasChanges = () => {
    return (
      fullName !== originalData.name || companyName !== originalData.companyName
    );
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <TooltipProvider>
      {showExplorePlans ? (
        <ExplorePlans />
      ) : (
        <div className='flex flex-col gap-4 p-4 max-w-7xl mx-auto h-full'>
          {/* Profile Section */}
          <div className='flex flex-col md:flex-row w-full gap-8'>
            <div className=' bg-[#eff5ff] rounded-lg p-6 w-full h-[400px] md:w-1/2 shadow-2xl border'>
              <form
                onSubmit={handleSubmit}
                className=' flex justify-center pt-10 h-full'
              >
                {/* User Details */}
                <div className='flex-[2] col-span-1 flex flex-col gap-2 pb-8'>
                  <div className='flex flex-col gap-'>
                    <Label className='text-md'>Name</Label>
                    <input
                      type='text'
                      id='fullName'
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className='border-none h-8 bg-transparent w-full text-2xl font-bold pt-0 placeholder:text-[#646464] text-[#646464] placeholder:text-2xl rounded-md focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      aria-label='Full Name'
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex flex-col gap-0'>
                        <Label className='text-md'>Email Address</Label>
                        <input
                          type='email'
                          id='emailAddress'
                          value={emailAddress}
                          readOnly
                          className='border-none bg-transparent w-full text-2xl font-bold pt-0 placeholder:text-[#646464] text-[#646464] placeholder:text-2xl rounded-md focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed'
                          aria-label='Email Address'
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email cannot be changed</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex flex-col gap-0'>
                        <Label className='text-md'>Phone Number</Label>
                        <input
                          type='tel'
                          id='phoneNumber'
                          value={phoneNumber}
                          readOnly
                          className='border-none h-8 bg-transparent w-full text-2xl font-bold pt-0 placeholder:text-[#646464] text-[#646464] placeholder:text-2xl rounded-md focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed'
                          aria-label='Phone Number'
                          placeholder='No Phone Number'
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Phone number cannot be changed</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className='flex flex-col gap-0'>
                    <Label className='text-md'>Company Name</Label>
                    <input
                      type='text'
                      id='companyName'
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className='border-none h-8 bg-transparent w-full text-2xl font-bold pt-0 placeholder:text-[#646464] text-[#646464] placeholder:text-2xl rounded-md focus-visible:border-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      aria-label='Company Name'
                      placeholder='Please Update Company Name'
                    />
                  </div>
                </div>
                {/* Avatar with Camera Icon */}
                <div className='flex flex-col flex-[1] justify-start gap-16 items-center h-full'>
                  <div className='relative h-40 w-40'>
                    <Avatar className='w-40 h-40'>
                      <Image
                        src='/images/Dummy profile.png'
                        alt='Avatar'
                        width={160}
                        priority
                        height={160}
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='absolute bottom-0 right-0 rounded-full shadow-md'
                      style={{ backgroundColor: '#1E88E5', color: 'white' }}
                    >
                      <Camera className='h-4 w-4' />
                    </Button>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          type='submit'
                          disabled={!hasChanges()}
                          className='bg-blue-500 text-white rounded-md hover:bg-blue-600 col-span-2'
                        >
                          Edit <Edit className='h-4 w-4 ml-2' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className='bg-blue-500 text-white border-none shadow-lg shadow-slate-600 '>
                        <p>No changes detected. Please update a field.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </form>
            </div>

            {/* Subscription Summary */}
            <div className='bg-[#eff5ff] rounded-lg shadow-2xl p-6 w-full md:w-1/2 border'>
              <h2 className='text-3xl font-semibold mt-14 mb-12'>
                Subscription Summary
              </h2>

              <div className='mb-8'>
                <div className='flex justify-between items-center mb-2'>
                  <div className='text-lg'>Listing's Usage</div>
                  <div className='text-lg text-gray-500'>10%</div>
                </div>
                <div className='w-full'>
                  <div className='bg-gray-200 rounded-full h-2 w-full'>
                    <div
                      className='bg-blue-500 rounded-full h-2'
                      style={{ width: '10%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className='mb-4'>
                <div className='flex justify-between items-center mb-2'>
                  <div className='text-lg'>Leads Usage</div>
                  <div className='text-lg text-gray-500'>20%</div>
                </div>
                <div className='w-full '>
                  <div className='bg-gray-200 rounded-full h-2 w-full'>
                    <div
                      className='bg-blue-500 rounded-full h-2'
                      style={{ width: '20%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row items-start md:items-center md:justify-between mt-4 bg-[#eff5ff] rounded-lg shadow-xl border gap-4 p-6 w-full'>
            <div>
              <div className='text-sm text-[#3b82f6]'>Plan Purchased</div>
              <div className='font-semibold'>
                Standard <span className='text-xs font-normal'>/month</span>
              </div>
            </div>
            <div>
              <div className='text-sm text-[#3b82f6]'>Expires In</div>
              <div className='font-semibold'>24th March 2025</div>
            </div>
            <Button
              className='bg-[#3b82f6] text-white rounded-md hover:bg-blue-600 ml-auto md:ml-0'
              onClick={handleExplorePlansClick}
            >
              Explore Plans <ChevronRight className='' />
            </Button>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};

export default ProfileForm;
