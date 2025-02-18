'use client';

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string;
  alternatePhone: string | null;
  isActive: boolean;
  budgetMin: number;
  budgetMax: number;
  preferredLocations: string[];
  propertyTypes: string[];
  requirements: string | null;
  note: string;
  listingId: string | null;
  brokerId: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

const Brokerdetail = () => {
  const [leadsData, setLeadsData] = useState<Lead[] | null>([]);
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className='w-full rounded-lg shadow-2xl my-6'>
      <CardHeader>
        <CardTitle className='text-xl sm:text-2xl'>Deals Details</CardTitle>
      </CardHeader>
      <CardContent>
        {leadsData?.length === 0 ? (
          <div>No leads data available</div>
        ) : (
          <div className='space-y-4'>
            {leadsData?.map((lead) => (
              <div
                key={lead.id}
                className='flex flex-col p-4 rounded-lg border space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
                  <Image
                    src='/images/Dummy profile.png'
                    alt={lead.name}
                    width={60}
                    height={60}
                    className='rounded-full object-cover'
                  />
                  <div className='text-center sm:text-left'>
                    <p className='text-xs font-medium'>Enquiry By</p>
                    <p className='text-md font-semibold'>{lead.name}</p>
                    <div className='flex items-center justify-center sm:justify-start gap-2 font-medium'>
                      <p className='text-xs leading-none'>Enquiry on</p>
                      <p className='text-xs font-semibold text-teal-600'>
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
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
                      <p className='text-xs'>{lead.phoneNumber}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0'>
                      <CiMail className='w-5 h-5' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-[#42A4AE] text-sm'>Email</span>
                      <p className='text-xs truncate max-w-[150px]'>
                        {lead.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button className='text-white bg-[#42A4AE] font-normal w-full sm:w-auto'>
                  <a
                    href={`mailto:${lead.email}`}
                    className='text-xs truncate text-gray-800 hover:text-blue-500'
                  >
                    Follow Up
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Brokerdetail;
