'use client';

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

import useAuth from '@/hooks/useAuth';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Lead } from '@/interfaces/Interface';

const Brokerdetail = () => {
  const [leadsData, setLeadsData] = useState<Lead[] | null>([]);
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('https://api.houzie.in/leads', {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        });
        setLeadsData(response.data);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [auth]);

  if (isLoading) return <div className='text-center py-8'>Loading...</div>;

  return (
    <Card className='w-full rounded-2xl shadow-xl shadow-[#dadbe5] my-6 bg-[#ffffff]'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Leads Details</CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        {leadsData?.length === 0 ? (
          <div className='text-center py-4'>No leads data available</div>
        ) : (
          <div className='space-y-4'>
            {leadsData?.map((lead) => (
              <div
                key={lead.id}
                className='flex flex-col sm:flex-row justify-between gap-4 bg-[#eff5ff] rounded-xl py-4 px-4 sm:px-6 md:px-8 lg:px-20 items-start sm:items-center border'
              >
                {/* Lead Info */}
                <div className='flex items-center space-x-4 w-full sm:w-1/3'>
                  <Image
                    src='/images/Dummy profile.png'
                    alt={lead.name}
                    width={50}
                    height={50}
                    className='rounded-full object-cover'
                  />
                  <div>
                    <p className='text-sm md:text-md text-[#3b82f6]'>
                      {new Date(lead.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className='text-sm md:text-md font-semibold'>
                      {lead.name}
                    </p>
                  </div>
                </div>

                {/* Interested In */}
                <div className='w-full sm:w-1/3 mt-2 sm:mt-0 flex flex-col justify-center items-start sm:items-center'>
                  <div className='flex flex-col justify-center items-start'>
                    <p className='text-sm md:text-md text-[#3b82f6]'>
                      Interested In
                    </p>
                    <p className='text-sm md:text-md font-semibold'>
                      {/* {lead.propertyName ? lead.propertyName : 'Property Name'} */}
                      Property Name
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className='flex flex-col items-start sm:items-end justify-center w-full sm:w-1/3 mt-2 sm:mt-0'>
                  <div className='flex flex-col sm:items-start justify-center'>
                    <div className='text-sm md:text-md text-[#3b82f6]'>
                      Contact Details
                    </div>
                    <div className='flex items-center justify-end space-x-2'>
                      <FaPhoneAlt className='text-sm md:text-md font-semibold' />
                      <p className='text-sm md:text-md font-semibold'>
                        +91 {lead.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Brokerdetail;
