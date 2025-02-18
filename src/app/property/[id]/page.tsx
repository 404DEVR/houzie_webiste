'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import useAuth from '@/hooks/useAuth';

import ItemGrid from '@/components/cards/IconGrid';
import MapCard from '@/components/cards/MapCard';
import PlacesNearby from '@/components/cards/PlacesNearby';
import ProfileCard from '@/components/cards/profilecard';
import PropertyHighlight from '@/components/cards/PropertyHighlights';
import PropertySuggestions from '@/components/cards/PropertySuggestions';
import AboutProperty from '@/components/detailspage/AboutProperty';
import HeaderContainer, {
  Property,
} from '@/components/detailspage/HeaderContainer';
import PropertyDetails from '@/components/detailspage/PropertyDetails';
import PropertyHighlights from '@/components/detailspage/PropertyHighlights';
import ImageGallery from '@/components/imagegrids/ImageGallery';
import { Button } from '@/components/ui/button';

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
      <div className='absolute inset-0 bg-black  bg-opacity-80 flex items-center justify-center rounded-lg z-10'>
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
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
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
        setPropertyData(data);
      } catch (error) {
        console.error('Error fetching property data:', error);
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
      <main className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 my-2 sm:my-3 bg-[#F4F4F4]'>
        <HeaderContainer propertyData={propertyData} />
        <ImageGallery propertyData={propertyData} />

        <div className='mt-4 sm:mt-7 flex flex-col lg:flex-row gap-4'>
          {/* Left column */}
          <div className='w-full flex flex-col lg:w-[65%] xl:w-[70%] order-2 lg:order-1'>
            <PropertyHighlights propertyData={propertyData} />
            <PropertyDetails propertyData={propertyData} />
            <AboutProperty propertyData={propertyData} />

            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <MapCard />
            </div>

            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <ItemGrid
                title='Amenities'
                data={propertyData.amenities}
                type='amenities'
              />
            </div>
            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <PlacesNearby />
            </div>
            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <PropertyHighlight propertyData={propertyData} />
            </div>
          </div>

          <div className='w-full ml-0 lg:w-[35%] xl:w-[40%] order-1 lg:order-2'>
            <div className='space-y-4'>
              <ProfileCardWithOverlay
                showOverlay={!auth?.accessToken}
                buttonClick={() => router.push('/login')}
              >
                <ProfileCard
                  propertyData={propertyData}
                  rating={4}
                  listingCount={10}
                  totalDeals={6}
                  postedDate={propertyData.createdAt}
                  showContact={false}
                  avatarUrl='/images/Dummy profile.png'
                />
              </ProfileCardWithOverlay>
              <ProfileCardWithOverlay
                showOverlay={!auth?.accessToken}
                buttonClick={() => router.push('/login')}
              >
                <ProfileCard
                  propertyData={propertyData}
                  rating={4}
                  listingCount={10}
                  totalDeals={6}
                  postedDate={propertyData.createdAt}
                  showContact={true}
                  avatarUrl='/images/Dummy profile.png'
                />
              </ProfileCardWithOverlay>
            </div>
          </div>
        </div>
        <div className='space-y-4 sm:space-y-6 my-4 sm:my-6'>
          <PropertySuggestions />
        </div>
      </main>
    </>
  );
}
