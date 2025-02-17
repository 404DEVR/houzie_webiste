'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useFilters } from '@/lib/context/FilterContext';

import { PropertyCard } from '@/components/cards/PropertyCard';
import LocalitiesGrid from '@/components/imagegrids/LocalitiesGrid';
import { PropertyFilters } from '@/components/propertpage/PropertyFilters';
import { PropertySearchHeader } from '@/components/propertpage/PropertySearchHeader';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface Property {}

export default function DetailsPage() {
  const { filters } = useFilters();
  const [activeView, setActiveView] = useState('list');
  const [properties, setProperties] = useState<Property>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://api.houzie.in/listings');
        setProperties(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <Image
          src='/images/loading.gif'
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
        src='/images/no-results.png'
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
          // Reset filters logic here
        }}
        className='px-4 py-2 bg-[#42A4AE] text-white'
      >
        Reset Filters
      </Button>
    </div>
  );

  const filteredProperties = properties.filter((property) => {
    // Filter by rent range
    if (property.price < filters.rent[0] || property.price > filters.rent[1]) {
      return false;
    }

    // Filter by property type
    if (
      filters.propertyType.length > 0 &&
      !filters.propertyType.includes(property.propertyType)
    ) {
      return false;
    }

    // Filter by BHK type
    if (
      filters.bhkType.length > 0 &&
      property.configuration &&
      !filters.bhkType.includes(property.configuration)
    ) {
      return false;
    }

    // Filter by available for
    if (
      filters.availableFor.length > 0 &&
      !filters.availableFor.includes(property.preferredTenant)
    ) {
      return false;
    }

    // Filter by furnishing
    if (
      filters.furnishing.length > 0 &&
      !filters.furnishing.includes(property.furnishing)
    ) {
      return false;
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      const hasAllSelectedAmenities = filters.amenities.every(
        (amenity) =>
          property.amenities.includes(amenity) ||
          property.features.includes(amenity)
      );
      if (!hasAllSelectedAmenities) {
        return false;
      }
    }

    // Filter by parking
    if (filters.parking.length > 0) {
      const hasSelectedParking = filters.parking.some((parkingType) =>
        property.amenities.includes(parkingType)
      );
      if (!hasSelectedParking) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      <main className='px-4 my-2 sm:my-3 bg-[#FFFFFF]'>
        <PropertySearchHeader />
        <PropertyFilters onViewChange={(view) => setActiveView(view)} />

        <Tabs value={activeView} className='w-full'>
          <TabsContent value='list' className='mt-0'>
            <div className='flex flex-col gap-4 p-4'>
              {filteredProperties && filteredProperties.length > 0 ? (
                filteredProperties.map((property, index) => (
                  <PropertyCard key={index} property={property} />
                ))
              ) : (
                <NoPropertiesFound />
              )}
            </div>
          </TabsContent>

          <TabsContent value='map' className='mt-0'>
            <div className='flex flex-col xl:flex-row gap-4 p-4 '>
              {/*Small Window Size Right side - Map */}
              <div className='xl:hidden w-full xl:w-1/3 rounded-lg '>
                <div className='h-[400px] w-[60%] mx-auto rounded-lg relative overflow-hidden'>
                  <Image
                    src='/images/Map.png'
                    alt='Map View'
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
              </div>

              {/* Left side - Properties and LocalitiesGrid */}
              <div className='w-full xl:w-2/3 pr-4'>
                <div className='flex flex-col gap-4 mb-4'>
                  {filteredProperties && filteredProperties.length > 0 ? (
                    filteredProperties.map((property, index) => (
                      <PropertyCard key={index} property={property} />
                    ))
                  ) : (
                    <NoPropertiesFound />
                  )}
                </div>
              </div>

              {/* Right side - Map */}
              <div className='hidden xl:block w-full lg:w-1/3 rounded-lg sticky top-0'>
                <div className='h-[400px] w-full rounded-lg relative overflow-hidden'>
                  <Image
                    src='/images/Map.png'
                    alt='Map View'
                    layout='fill'
                    objectFit='cover'
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
