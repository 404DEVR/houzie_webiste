'use client';

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

import { toast } from '@/hooks/use-toast';
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
        const response = await axios.get(
          'https://api.houzie.in/leads?query=Ma',
          {
            headers: {
              Authorization: `Bearer ${auth?.accessToken}`,
            },
          }
        );
        console.log(response.data);
        setLeadsData(response.data);
        setIsLoading(false);
      } catch (err) {
        toast({
          title: 'Failed ',
          description: 'Failed to fetch leads data',
        });
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
                <div className='flex items-center space-x-4 w-full sm:w-auto'>
                  <Image
                    src='/images/Dummy profile.png'
                    alt={lead.name}
                    width={50}
                    height={50}
                    className='rounded-full object-cover'
                  />
                  <div>
                    <p className='text-sm md:text-md text-[#42A4AE]'>
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
                <div className='w-full sm:w-auto mt-2 sm:mt-0'>
                  <p className='text-sm md:text-md text-[#42A4AE]'>
                    Interested In
                  </p>
                  <p className='text-sm md:text-md font-semibold'>
                    Property Name
                  </p>
                </div>

                {/* Contact Details */}
                <div className='flex flex-col items-start justify-center w-full sm:w-auto mt-2 sm:mt-0'>
                  <div className='text-sm md:text-md text-[#42A4AE]'>
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Brokerdetail;
