'use client';

import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useFilters } from '@/lib/context/FilterContext';
import useAuth from '@/hooks/useAuth';

import { PropertyCard } from '@/components/cards/PropertyCard';
import LocalitiesGrid from '@/components/imagegrids/LocalitiesGrid';
import { PropertyFilters } from '@/components/propertpage/PropertyFilters';
import { PropertySearchHeader } from '@/components/propertpage/PropertySearchHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';

interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
  };
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  mainImage: string;
  security: number;
  brokerage: number;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  availableFrom: string;
}

export default function DetailsPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const { filters } = useFilters();
  const [activeView, setActiveView] = useState('list');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  const loadImage = useCallback(
    async (url: string) => {
      if (imageCache[url]) {
        return imageCache[url];
      }

      try {
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = response.data;
        const imageUrl = URL.createObjectURL(blob);

        setImageCache((prevCache) => ({ ...prevCache, [url]: imageUrl }));
        return imageUrl;
      } catch (error) {
        console.error('Error loading image:', error);
        return '/svg/no-results.svg';
      }
    },
    [imageCache]
  );

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const requestBody = {
        propertyType:
          filters.propertyType.length > 0
            ? filters.propertyType
            : ['FLAT_APARTMENT'],
      };

      const url = `https://api.houzie.in/listings`;

      const response = await axios.get(url);

      setProperties(response.data.data);
      // console.log('Fetched Properties:', response.data.data);
      // console.log('Request Body:', JSON.stringify(requestBody));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to fetch properties. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters.propertyType]);

  useEffect(() => {
    async function preloadImages() {
      if (properties && properties.length > 0) {
        for (const property of properties) {
          if (property.mainImage) {
            await loadImage(property.mainImage);
          }
          if (property.photos && property.photos.length > 0) {
            for (const photo of property.photos) {
              await loadImage(photo);
            }
          }
        }
      }
    }
    preloadImages();
  }, [properties, loadImage]);

  if (loading) {
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  const NoPropertiesFound = () => (
    <div className='flex flex-col items-center justify-center py-20 bg-gray-100'>
      <Image
        src='/svg/no-results.svg'
        alt='No Properties Found'
        width={200}
        height={200}
        className='mb-8'
      />
      <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
        No Properties Found
      </h2>
      <p className='text-gray-600 mb-4 text-center max-w-md'>
        We couldn't find any properties matching your current filters. Try
        adjusting your search criteria or explore different options.
      </p>
      <Button
        onClick={() => {
          router.push('/listings');
        }}
        className='px-4 py-2 bg-[#42A4AE] text-white'
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <>
      <main className='px-4 my-2 sm:my-3 bg-[#FFFFFF]'>
        <PropertySearchHeader />
        <PropertyFilters onViewChange={(view) => setActiveView(view)} />

        <Tabs value={activeView} className='w-full'>
          <TabsContent value='list' className='mt-0'>
            <div className='flex flex-col gap-4 p-4'>
              {properties && properties.length > 0 ? (
                properties.map((property, index) => (
                  <PropertyCard
                    key={index}
                    property={property}
                    loadImage={loadImage}
                  />
                ))
              ) : (
                <NoPropertiesFound />
              )}
            </div>
          </TabsContent>

          <TabsContent value='map' className='mt-0'>
            <div className='flex flex-col xl:flex-row gap-4 p-4 '>
              {/* Small Window Size Right side - Map */}
              <div className='xl:hidden w-full xl:w-1/3 rounded-lg '>
                <div className='h-[400px] w-[60%] mx-auto rounded-lg relative overflow-hidden'>
                  {/*  USE MAIN IMAGE FROM API */}
                  <Image
                    src={
                      properties[0]?.mainImage
                        ? imageCache[properties[0].mainImage] ||
                          '/images/Map.png'
                        : '/images/Map.png'
                    } // Fallback to local image if mainImage is missing
                    alt='Map View'
                    layout='fill'
                    objectFit='cover'
                    fill // Use fill instead of width and height for layout="fill"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Left side - Properties and LocalitiesGrid */}
              <div className='w-full xl:w-2/3 pr-4'>
                <div className='flex flex-col gap-4 mb-4'>
                  {properties && properties.length > 0 ? (
                    properties.map((property, index) => (
                      <PropertyCard
                        key={index}
                        property={property}
                        loadImage={loadImage}
                      />
                    ))
                  ) : (
                    <NoPropertiesFound />
                  )}
                </div>
              </div>

              {/* Right side - Map */}
              <div className='hidden xl:block w-full lg:w-1/3 rounded-lg sticky top-0'>
                <div className='h-[400px] w-full rounded-lg relative overflow-hidden'>
                  {/* USE MAIN IMAGE FROM API */}
                  <Image
                    src={
                      properties[0]?.mainImage
                        ? imageCache[properties[0].mainImage] ||
                          '/images/Map.png'
                        : '/images/Map.png'
                    }
                    alt='Map View'
                    layout='fill'
                    objectFit='cover'
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <LocalitiesGrid normal={true} />
      </main>
    </>
  );
}
