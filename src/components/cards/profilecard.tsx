// components/ProfileCard.tsx
'use client';

import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios'; // Import Axios

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import useAuth from '@/hooks/useAuth';

interface ProfileCardProps {
  brokerid: string;
  name?: string; // Make these optional since we're fetching them
  rating?: number;
  listingCount?: number;
  totalDeals?: number;
  memberSince?: string;
  postedDate?: string;
  phoneNumber?: string;
  email?: string;
  showContact?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

const ProfileCard = ({
  brokerid,
  showContact = false,
  postedDate,
}: ProfileCardProps) => {
  const { auth } = useAuth();
  const [brokerData, setBrokerData] = useState<ProfileCardProps>({
    brokerid: brokerid,
  });
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.houzie.in/broker/stats', {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        });
        const data = response.data;
        console.log(stats);
        setStats(data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
        ); // Fetch data from API
        setBrokerData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch broker data:', error);
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokerData();
  }, [brokerid]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'; // Return 'N/A' if no date is provided
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options); // Format the date
  };

  if (isLoading) {
    return <div>Loading broker profile...</div>; // Or a more sophisticated loader
  }

  const {
    name,
    rating,
    listingCount,
    totalDeals,
    memberSince,
    phoneNumber,
    email,
    avatarUrl,
  } = brokerData; // Destructure from brokerData

  return (
    <Card className='w-full max-w-sm mx-auto md:ml-auto mb-6'>
      <div className='flex flex-col items-center'>
        <div className='w-24 h-24 rounded-full bg-gray-200 mt-6 mb-4'>
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt={name || 'Broker Avatar'} // Use a default alt
              width={96}
              height={96}
              className='rounded-full object-cover'
            />
          )}
        </div>

        <div className='w-full px-6 pb-4'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-sm leading-none '>Posted By</p>
              <h3 className='font-semibold'>
                {brokerData.name || 'Broker Name'}
              </h3>
              {/* Use a default name */}
              <div className='flex gap-1 mt-1'>
                {[...Array(5)].map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < (rating || 0) ? 'text-[#42A4AE]' : 'text-[#B3F8FF]' // Default rating to 0
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm leading-none'>Posted on</p>
              <p className='text-sm font-semibold text-teal-600'>
                {postedDate ? formatDate(postedDate) : 'N/A'}
              </p>
            </div>
          </div>

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
                    <p className='text-xs truncate'>{brokerData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='mt-3 space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm '>No. of Listing</span>
              <span className='text-sm text-teal-600'>
                {listingCount || 0}
              </span>{' '}
              {/* Default to 0 */}
            </div>
            <div className='flex justify-between'>
              <span className='text-sm '>Total Deals</span>
              <span className='text-sm text-teal-600'>
                {totalDeals || 0}
              </span>{' '}
              {/* Default to 0 */}
            </div>
            <div className='flex justify-between'>
              <span className='text-sm '>Member Since</span>
              <span className='text-sm text-teal-600'>
                {brokerData?.createdAt
                  ? formatDate(brokerData?.createdAt)
                  : 'N/A'}
              </span>{' '}
              {/* Default to 'N/A' */}
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
