'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import LeadForm from '@/components/detailspage/LeadFrom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Stats } from '@/interfaces/Interface';
import { ProfileCardProps } from '@/interfaces/PropsInterface';

const ProfileCard = ({
  propertyData,
  postedDate,
  avatarUrl,
}: ProfileCardProps) => {
  const toast = useCustomToast();
  const { auth } = useAuth();
  const [brokerData, setBrokerData] = useState<ProfileCardProps>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const brokerid = propertyData ? propertyData.broker.id : '';
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.houzie.in/broker/stats', {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        });
        const data = response.data;
        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth?.accessToken]);

  useEffect(() => {
    const fetchBrokerData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.houzie.in/broker/${brokerid}`,
          {
            headers: {
              Authorization: `Bearer ${auth?.accessToken}`,
            },
          }
        );
        setBrokerData(response.data);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokerData();
  }, [brokerid, auth?.accessToken]);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!brokerid) return;

      try {
        const response = await axios.get(
          `https://api.houzie.in/connection/status/${brokerid}`,
          {
            headers: {
              Authorization: `Bearer ${auth?.accessToken}`,
            },
          }
        );
        setIsConnected(response.data.isConnected);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnectionStatus();
  }, [brokerid, auth?.accessToken]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleLeadSubmit = async (formData) => {
    try {
      await axios.post('https://api.houzie.in/leads', formData, {
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
        },
      });
      setIsConnected(true);
    } catch (error) {
      toast.error({ title: 'Error', description: 'Error submitting lead' });
    }
  };

  // const handleConnect = async () => {
  //   try {
  //     await axios.post(
  //       `https://api.houzie.in/connection/connect/${brokerid}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${auth?.accessToken}`,
  //         },
  //       }
  //     );
  //     setIsConnected(true);
  //   } catch (error) {
  //     Toast({ title: 'Error connecting:' });
  //   }
  // };

  const handleEnquire = () => {
    toast.info({ title: 'Info', description: 'Enquire button clicked' });
  };

  if (isLoading) {
    return <div>Loading broker profile...</div>;
  }

  const rating = 3;
  return (
    <Card className='w-full bg-[#eff5ff] md:ml-auto mb-6'>
      <div className='flex flex-col items-center'>
        <div className='w-24 h-24 rounded-full bg-gray-200 mt-6 mb-4'>
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt='Broker Avatar'
              width={96}
              height={96}
              className='rounded-full object-cover'
            />
          )}
        </div>

        <div className='w-full px-6 pb-4'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='font-semibold'>
                {brokerData && brokerData.name
                  ? brokerData.name
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(' ')
                  : 'Broker Name'}
              </h3>

              <div className='flex gap-1 mt-1'>
                {[...Array(5)].map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < (rating || 0) ? 'text-[#3b8ff6]' : 'text-[#bfdbfe]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm leading-none'>Posted on</p>
              <p className='text-sm font-semibold text-[#3b8ff6]'>
                {postedDate ? formatDate(postedDate) : 'N/A'}
              </p>
            </div>
          </div>

          <div className='mt-3 space-y-2'>
            <div className='grid grid-cols-2 gap-2'>
              {brokerData?.phoneNumber && (
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center'>
                    <BsTelephone className='w-5 h-5' />
                  </div>
                  <div className='flex flex-col min-w-0'>
                    <span className='text-[#3b8ff6] text-sm'>Call us</span>
                    <p className='text-xs truncate'>
                      {brokerData?.phoneNumber}
                    </p>
                  </div>
                </div>
              )}
              {brokerData?.email && (
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center'>
                    <CiMail className='w-5 h-5' />
                  </div>
                  <div className='flex flex-col min-w-0 flex-1'>
                    <span className='text-[#3b8ff6] text-sm'>Email</span>
                    <a
                      href={`mailto:${brokerData ? brokerData.email : ''}`}
                      className='text-xs truncate text-gray-800 hover:text-blue-500'
                    >
                      {brokerData ? brokerData.email : ''}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='mt-3 space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm '>No. of Listing</span>
              <span className='text-sm text-[#3b8ff6]'>
                {stats ? stats.activeListings + stats.inActiveListings : 0}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm '>Total Deals</span>
              <span className='text-sm text-[#3b8ff6]'>
                {stats ? stats.activeLeads + stats.inActiveLeads : 0}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm '>Member Since</span>
              <span className='text-sm text-[#3b8ff6]'>
                {brokerData?.createdAt
                  ? formatDate(brokerData?.createdAt)
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* <div className='mt-3'>
            <label className='flex items-center space-x-2'>
              <Checkbox className='h-5 w-5 rounded border-2 border-[#3b8ff6] text-[#3b8ff6] focus:ring-[#3b8ff6] focus:ring-offset-0' />
              <span className='text-sm text-gray-600'>
                Allow broker to contact me
              </span>
            </label>
          </div> */}

          <div className='mt-3 space-y-2'>
            {isConnected ? (
              <Button
                className='w-full bg-[#3b8ff6] hover:bg-[#bfdbfe] text-white'
                onClick={handleEnquire}
              >
                Enquire
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='w-full mt-3 bg-[#3b8ff6] hover:bg-[#bfdbfe] text-white'>
                    Connect
                  </Button>
                </DialogTrigger>
                <DialogContent className='h-[90%] overflow-y-auto'>
                  <DialogHeader>
                    <DialogTitle>Submit Lead</DialogTitle>
                  </DialogHeader>
                  <LeadForm
                    onSubmit={handleLeadSubmit}
                    propertyData={propertyData}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
