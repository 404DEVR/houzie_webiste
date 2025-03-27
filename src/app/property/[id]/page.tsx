'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import ItemGrid from '@/components/cards/IconGrid';
import MapCard from '@/components/cards/MapCard';
import NearbyAmenities from '@/components/cards/NearbyAmenities';
import OccupantData from '@/components/cards/OccupantData';
import ProfileCard from '@/components/cards/profilecard';
import PropertyInfo from '@/components/cards/PropertyInfo';
import PropertySuggestions from '@/components/cards/PropertySuggestions';
import HeaderContainer from '@/components/detailspage/HeaderContainer';
import ImageGallery from '@/components/imagegrids/ImageGallery';
import NavbarDetailsPage from '@/components/Navbars/NavbarDetailsPage';
import { Button } from '@/components/ui/button';

import { PropertyPost } from '@/interfaces/Interface';

interface DetailsPageClientProps {
  params: { id: string };
}

const ProfileCardWithOverlay = ({ children, showOverlay, buttonClick }) => (
  <div className='relative'>
    {/* Render the card */}
    <div
      className={`${
        showOverlay ? 'opacity-30' : 'opacity-100'
      } transition-opacity`}
    >
      {children}
    </div>

    {/* Render the overlay if required */}
    {showOverlay && (
      <div className='absolute inset-0 bg-black  bg-opacity-80 flex items-center justify-center rounded-xl z-10'>
        <div className='text-center space-y-4 p-4'>
          <h3 className='text-white text-3xl font-semibold'>
            Sign In to View Details
          </h3>
          <p className='text-gray-200 text-md'>
            Sign in to access broker details, contact information, and more.
          </p>
          <Button
            onClick={buttonClick}
            className='bg-[#42A4AE] text-white px-4 py-2 rounded-lg font-medium  transition duration-300'
          >
            Sign In
          </Button>
        </div>
      </div>
    )}
  </div>
);

export default function DetailsPageClient({ params }: DetailsPageClientProps) {
  const toast = useCustomToast();
  const [propertyData, setPropertyData] = useState<PropertyPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [address, setAddress] = useState('');
  const { auth } = useAuth();

  useEffect(() => {
    const fetchPropertyData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.houzie.in/listings/${params.id}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch property data');
        }
        const data = await response.json();
        setPropertyData(data.data);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <Image
          src='/svg/loading.gif'
          alt='Loading'
          width={200}
          height={200}
          className='mb-8'
        />
        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
          Loading Properties
        </h2>
        <p className='text-gray-600'>
          Please wait while we fetch the latest listings for you.
        </p>
      </div>
    );
  }

  if (!propertyData) {
    return <div>Failed to load property data.</div>;
  }
  return (
    <>
      <NavbarDetailsPage stickyPage='property' />
      <main className='px-4 sm:px-6 md:px-8  mb-2 sm:mb-3 '>
        <HeaderContainer
          propertyData={propertyData}
          setIsLoading={setIsLoading}
          address={address}
          setAddress={setAddress}
        />
        <div className='w-full'>
          <ImageGallery propertyData={propertyData} />
        </div>

        <div className='mt-4 sm:mt-7 flex flex-col justify-start items-start lg:flex-row gap-4'>
          {/* Left column */}
          <div className='w-full pr-4 flex flex-col md:w-[75%]'>
            <div className='w-full'>
              <PropertyInfo propertyData={propertyData} />
            </div>
            <div className='space-y-4 sm:space-y-6 mt-0 z-0'>
              {propertyData && (
                <MapCard propertyData={propertyData} address={address} />
              )}
            </div>
            <div className='space-y-4 sm:space-y-6 my-4 pb-4 border-b border-gray-200'>
              <ItemGrid
                title='Amenities'
                data={propertyData.amenities}
                type='amenities'
              />
            </div>
            {propertyData.furnishingExtras.length > 0 && (
              <div className='space-y-4 sm:space-y-6 my-4 pb-4 border-b border-gray-200'>
                <ItemGrid
                  title='Furnishing'
                  data={propertyData.furnishingExtras}
                  type='furnishing'
                />
              </div>
            )}

            {propertyData.houseFurnishingItems &&
              propertyData.houseFurnishingItems.length > 0 && (
                <div className='space-y-4 sm:space-y-6 my-4 pb-4 border-b border-gray-200'>
                  <ItemGrid
                    title='House Furnishing'
                    data={propertyData.houseFurnishingItems}
                    type='furnishing'
                  />
                </div>
              )}
            {propertyData.roomFurnishingItems &&
              propertyData.roomFurnishingItems?.length > 0 && (
                <div className='space-y-4 sm:space-y-6 my-4 pb-4 border-b border-gray-200'>
                  <ItemGrid
                    title='Room Furnishing'
                    data={propertyData.roomFurnishingItems}
                    type='furnishing'
                  />
                </div>
              )}

            <div className='space-y-4 sm:space-y-6 my-4 border-b pb-4 border-gray-200'>
              <NearbyAmenities propertyData={propertyData} />
            </div>
            {propertyData?.occupants && (
              <div className='space-y-4 sm:space-y-6  my-4 border-b pb-4 border-gray-200'>
                <OccupantData propertyData={propertyData} />
              </div>
            )}
          </div>
          <div className='w-full md:w-[25%] sticky top-0'>
            <div className='space-y-4'>
              <ProfileCard
                propertyData={propertyData}
                rating={4}
                listingCount={10}
                totalDeals={6}
                postedDate={propertyData.createdAt}
                showContact={false}
                avatarUrl='/images/Dummy profile.png'
              />
            </div>
          </div>
        </div>
        <div className=' space-y-4 sm:space-y-6 my-4 sm:my-6'>
          <PropertySuggestions />
        </div>
      </main>
    </>
  );
}
