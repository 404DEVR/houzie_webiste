// components/ProfileCard.tsx
'use client';

import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import useAuth from '@/hooks/useAuth';

interface ProfileCardProps {
  name: string;
  rating: number;
  listingCount: number;
  totalDeals: number;
  memberSince: string;
  postedDate: string;
  phoneNumber?: string;
  email?: string;
  showContact?: boolean;
  avatarUrl?: string;
}

const ProfileCard = ({
  name,
  rating,
  listingCount,
  totalDeals,
  memberSince,
  postedDate,
  phoneNumber,
  email,
  showContact = false,
  avatarUrl,
}: ProfileCardProps) => {
  const {auth}=useAuth()
  return (
    <Card className='w-full max-w-sm mx-auto md:ml-auto mb-6'>
      <div className='flex flex-col items-center'>
        <div className='w-24 h-24 rounded-full bg-gray-200 mt-6 mb-4'>
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt={name}
              width={96}
              height={96}
              className='rounded-full object-cover'
            />
          )}
        </div>

        <div className='w-full px-6 pb-4'>
          {!auth && (
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm leading-none '>Posted By</p>
                <h3 className='font-semibold'>{name}</h3>
                <div className='flex gap-1 mt-1'>
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < rating ? 'text-[#42A4AE]' : 'text-[#B3F8FF]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm leading-none'>Posted on</p>
                <p className='text-sm font-semibold text-teal-600'>
                  {postedDate}
                </p>
              </div>
            </div>
          )}

          {phoneNumber && email && (
            <div className='mt-3 space-y-2'>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                    <BsTelephone className=' w-5 h-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[#42A4AE] text-sm'>Call us</span>
                    <p className='text-xs'>{phoneNumber}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                    <CiMail className=' w-5 h-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[#42A4AE] text-sm'>Email</span>
                    <p className='text-xs truncate'>{email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='mt-3 space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm '>No. of Listing</span>
              <span className='text-sm text-teal-600'>{listingCount}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm '>Total Deals</span>
              <span className='text-sm text-teal-600'>{totalDeals}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm '>Member Since</span>
              <span className='text-sm text-teal-600'>{memberSince}</span>
            </div>
          </div>

          {!showContact && (
            <div className='mt-3'>
              <label className='flex items-center space-x-2'>
                <Checkbox className='h-5 w-5 rounded border-2 border-[#42A4AE] text-[#42A4AE] focus:ring-[#42A4AE] focus:ring-offset-0' />
                <span className='text-sm text-gray-600'>
                  Allow broker to contact me
                </span>
              </label>
            </div>
          )}

          {phoneNumber && email ? (
            <div className='mt-3 space-y-2'>
              <Button className='w-full bg-[#42A4AE] hover:bg-[#3a949d] text-white'>
                Enquiry
              </Button>
            </div>
          ) : (
            <Button className='w-full mt-3 bg-[#42A4AE] hover:bg-[#3a949d] text-white'>
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
