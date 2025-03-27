'use client';

import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Stats, UserData } from '@/interfaces/Interface';
import { ProfileCardProps } from '@/interfaces/PropsInterface';

const ProfileCard = ({
  propertyData,
  postedDate,
  avatarUrl,
}: ProfileCardProps) => {
  const toast = useCustomToast();
  const { auth } = useAuth();
  const router = useRouter();
  const [brokerData, setBrokerData] = useState<ProfileCardProps>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const brokerid = propertyData ? propertyData.broker.id : '';
  const [isConnected, setIsConnected] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

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
    const fetchUserData = async () => {
      if (auth?.userid) {
        const response = await axios.get(`https://api.houzie.in/profile`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setUserData(response.data);
      }
    };
    fetchUserData();
  }, [auth]);

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

  const handleLeadSubmit = async () => {
    if (!auth?.accessToken) {
      router.push('/login');
    }

    const formdata = {
      name: userData?.name || '',
      phoneNumber: userData?.phoneNumber || '',
      email: userData?.email || '',
      budgetMin: 0,
      budgetMax: 0,
      preferredLocations: [],
      propertyTypes: propertyData ? [propertyData.propertyType] : [],
      note: '',
    };
    try {
      await axios.post(
        'https://api.houzie.in/leads',
        formdata,

        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        }
      );
      setIsConnected(true);
      setSuccessDialog(true);
    } catch (error) {
      console.log(error);
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
    <Card className='w-full md:ml-auto mb-6 rounded-xl'>
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
          <div className='flex justify-between items-center'>
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

              <div className='flex gap-1'>
                {[...Array(5)].map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`w-4 h-4 ${
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
              <Button
                onClick={() => {
                  handleLeadSubmit();
                }}
                className='w-full mt-3 bg-[#3b8ff6] hover:bg-[#bfdbfe] text-white'
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>
      <Dialog onOpenChange={setSuccessDialog} open={successDialog}>
        <DialogContent className='h-auto overflow-y-auto'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className='flex flex-col justify-center items-center space-y-3'>
            <Image
              src='/svg/success.svg'
              alt='/svg/success.svg'
              width={100}
              height={100}
            />
            <div className='flex flex-col gap-8 justify-center  items-center'>
              <h1 className='text-2xl font-semibold'>
                Request Raised Successfully
              </h1>
              <p className='text-sm text-gray-700'>
                Thank you for sharing your preferences! Our team will review
                your requirements, and we'll notify you if a matching property
                becomes available.<br></br> Stay tuned for updates!
              </p>
            </div>

            <Button
              size='custom'
              className='flex justify-center items-center w-auto p-4  text-white bg-[#3b8ff6]'
              onClick={() => setSuccessDialog(false)}
            >
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfileCard;
