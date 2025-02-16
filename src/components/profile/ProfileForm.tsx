'use client';

import { Camera, ListIcon, Settings, UserRoundPen } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios'; // Import Axios

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';

interface ProfileFormInterface {
  handleTabChange: (any: any) => void;
}

const ProfileForm = ({ handleTabChange }: ProfileFormInterface) => {
  const { auth } = useAuth();
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.houzie.in/profile/${auth?.userid}`
        );
        setFullName(response.data.name ? response.data.name : '');
        setEmailAddress(response.data.email ? response.data.email : '');
        setPhoneNumber(
          response.data.phoneNumber ? response.data.phoneNumber : ''
        );
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [auth?.userid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `https://api.houzie.in/profile/${userId}`,
        {
          name: fullName,
          email: emailAddress,
          phoneNumber: phoneNumber,
        }
      );

      alert('Profile Updated!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error appropriately (e.g., display an error message)
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className='container mx-auto pb-8 pt-4 '>
      <div className='bg-white  p-6 md:w-[60%] mx-auto'>
        <div className='flex flex-col md:flex-row items-start gap-16'>
          {/* Avatar Section */}
          <div className='flex flex-col items-center'>
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

          {/* Form Section */}
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
                <Input
                  type='email'
                  id='emailAddress'
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder='Enter your email address'
                  className='rounded-md'
                />
              </div>

              <div>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <Input
                  type='tel'
                  id='phoneNumber'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder='Enter your phone number'
                  className='rounded-md'
                />
              </div>

              <Button type='submit' className='w-full rounded-md'>
                Update Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className='border-b-2 py-1 flex gap-4'>
        <Button
          onClick={() => handleTabChange('myListing')}
          variant='ghost'
          className='w-40 flex justify-center items-center hover:text-white hover:bg-[#42A4AE]'
        >
          <ListIcon />
          My Listings
        </Button>
        <Button className='text-white bg-[#42A4AE] w-40 rounded-md flex justify-center items-center'>
          <UserRoundPen />
          Profile
        </Button>
        <Button
          onClick={() => handleTabChange('settings')}
          variant='ghost'
          className='w-40 flex justify-center items-center hover:text-white hover:bg-[#42A4AE]'
        >
          <Settings />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
