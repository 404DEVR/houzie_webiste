'use client';

import Image from 'next/image';
import React from 'react';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const dummyData = [
  {
    avatarUrl: '/images/Dummy profile.png',
    name: 'Full Name',
    enquiryDate: '18 Jan, 2025',
    phone: '+91 73276941125',
    email: 'name@gmail.com',
  },
  {
    avatarUrl: '/images/Dummy profile.png',
    name: 'Full Name',
    enquiryDate: '18 Jan, 2025',
    phone: '+91 73276941125',
    email: 'name@gmail.com',
  },
  {
    avatarUrl: '/images/Dummy profile.png',
    name: 'Full Name',
    enquiryDate: '18 Jan, 2025',
    phone: '+91 73276941125',
    email: 'name@gmail.com',
  },
  {
    avatarUrl: '/images/Dummy profile.png',
    name: 'Full Name',
    enquiryDate: '18 Jan, 2025',
    phone: '+91 73276941125',
    email: 'name@gmail.com',
  },
];

const Brokerdetail = () => {
  return (
    <Card className='w-full rounded-lg shadow-2xl my-6'>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Deals Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {dummyData.map((deal, index) => (
            <div
              key={index}
              className='flex flex-col p-4 rounded-lg border space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
                <Image
                  src={deal.avatarUrl}
                  alt={deal.name}
                  width={60}
                  height={60}
                  className='rounded-full object-cover'
                />
                <div className='text-center sm:text-left'>
                  <p className='text-xs font-medium'>Enquiry By</p>
                  <p className='text-md font-semibold'>{deal.name}</p>
                  <div className='flex items-center justify-center sm:justify-start gap-2 font-medium'>
                    <p className='text-xs leading-none'>Enquiry on</p>
                    <p className='text-xs font-semibold text-teal-600'>
                      {deal.enquiryDate}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0'>
                    <BsTelephone className='w-5 h-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[#42A4AE] text-sm'>Call us</span>
                    <p className='text-xs'>{deal.phone}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0'>
                    <CiMail className='w-5 h-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[#42A4AE] text-sm'>Email</span>
                    <p className='text-xs truncate max-w-[150px]'>{deal.email}</p>
                  </div>
                </div>
              </div>

              <Button className='text-white bg-[#42A4AE] font-normal w-full sm:w-auto'>
                Follow Up
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Brokerdetail;