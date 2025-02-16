'use client';

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
import useAuth from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DetailsPageClientProps {
  params: { id: string };
}

export default function DetailsPageClient({ params }: DetailsPageClientProps) {
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const accessToken = auth?.accessToken;
        if (!accessToken) {
          throw new Error('No access token available');
        }
        const response = await fetch(
          `https://api.houzie.in/listings/${params.id}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNTMwMmY2NC02MDdmLTQ0NDUtOTJiOC1hY2E1MzVhMmNiNWYiLCJlbWFpbCI6InJvc2hhbjUyQGdtYWlsLmNvbSIsInJvbGUiOiJCUk9LRVIiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpc1Bob25lVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE3Mzk3MDQ1NDMsImV4cCI6MTczOTcwNTQ0M30.wgwuWaIIZqdX4Q_BvxD1Mrp5Z5VndfMroqA7KbaoUM0`,
            },
          }
        );
        const data = await response.json();
        setPropertyData(data);
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };

    fetchPropertyData();
  }, [params.id]);

  if (!propertyData) {
    return <div>Loading...</div>;
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

          {/* Right column - Profile Cards */}
          <div className='w-full ml-0 lg:w-[35%] xl:w-[30%] order-1 lg:order-2'>
            <div className='space-y-4'>
              <ProfileCard
                name='Full Name'
                rating={4}
                listingCount={10}
                totalDeals={6}
                memberSince='18 Jan, 2024'
                postedDate='18 Jan, 2025'
                showContact={false}
                avatarUrl='/images/Dummy profile.png'
              />
              <ProfileCard
                name='Full Name'
                rating={4}
                listingCount={10}
                totalDeals={6}
                memberSince='18 Jan, 2024'
                postedDate='18 Jan, 2025'
                phoneNumber='+91 7326941125'
                email='name@gmail.com'
                showContact={true}
                avatarUrl='/images/Dummy profile.png'
              />
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
