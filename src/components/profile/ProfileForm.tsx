'use client';

import axios from 'axios'; // Import Axios
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ProfileFormInterface } from '@/interfaces/PropsInterface';

const ProfileForm = ({ page }: ProfileFormInterface) => {
  const { auth } = useAuth();
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        toast({ title: 'Failed to fetch profile:' });
        // Handle error appropriately (e.g., display an error message)
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
      email: emailAddress,
      phoneNumber: phoneNumber,
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

        alert('Profile Updated Successfully!');
      }
    } catch (error) {
      toast({
        title: 'Failed to Update',
        description: 'Failed to update profile. Please try again.',
      });
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <TooltipProvider>
      <div className='mx-auto h-auto'>
        <div className='bg-white p-6 mx-auto '>
          <div className='flex flex-col items-center gap-16 relative shadow-lg shadow-white'>
            <div className='flex flex-col items-center absolute -top-40'>
              <Avatar className='w-40 h-40 relative bg-gray-200 overflow-visible'>
                <Image
                  src='/images/Dummy profile.png'
                  alt='Profile Avatar'
                  width={200}
                  height={200}
                  className='rounded-full object-cover'
                />
                <Button
                  variant='secondary'
                  size='icon'
                  className='absolute bottom-0 right-0 rounded-full shadow-md'
                  style={{ backgroundColor: '#1E88E5', color: 'white' }}
                >
                  <Camera className='h-4 w-4' />
                </Button>
              </Avatar>
            </div>

            <div className='w-full'>
              <h1 className='text-2xl font-semibold mb-4'>Profile</h1>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='fullName'>Full Name</Label>
                  <Input
                    type='text'
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='Enter your full name'
                    className='rounded-md'
                  />
                </div>

                <div>
                  <Label htmlFor='emailAddress'>Email Address</Label>
                  <Tooltip>
                    <TooltipTrigger className='w-full text-start'>
                      <Input
                        type='email'
                        id='emailAddress'
                        value={emailAddress}
                        disabled
                        className='w-full rounded-md bg-gray-100 cursor-not-allowed'
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      This email address cannot be Changed.
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div>
                  <Label htmlFor='phoneNumber'>Phone Number</Label>
                  <Tooltip>
                    <TooltipTrigger className='w-full'>
                      <Input
                        type='tel'
                        id='phoneNumber'
                        value={phoneNumber}
                        disabled
                        className='w-full rounded-md bg-gray-100 cursor-not-allowed'
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      This phone number cannot be Changed.
                    </TooltipContent>
                  </Tooltip>
                </div>
                {page === 'user' ? (
                  <Button
                    type='submit'
                    className='bg-[#f5f5fa] text-center text-[#60a5fa] px-4 font-normal py-4 rounded-lg border-none'
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    className='bg-[#f5f5fa] text-center text-[#60a5fa] px-4 font-normal py-4 rounded-lg border-none'
                  >
                    Update Profile
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProfileForm;
