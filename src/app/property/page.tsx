'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { PropertyCard } from '@/components/cards/PropertyCard';
import LocalitiesGrid from '@/components/imagegrids/LocalitiesGrid';
import { PropertyFilters } from '@/components/propertpage/PropertyFilters';
import { PropertySearchHeader } from '@/components/propertpage/PropertySearchHeader';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import axios from 'axios';

export default function DetailsPage() {
  const [activeView, setActiveView] = useState('list');
  // const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     try {
  //       const response = await axios.get('https://api.houzie.in/listings');
  //       setProperties(response.data.data);
  //       console.log(response.data.data);
  //       setLoading(false);
  //     } catch (err: any) {
  //       setError(err.message || 'Failed to fetch properties');
  //       setLoading(false);
  //     }
  //   };

  //   fetchProperties();
  // }, []);

  // if (loading) {
  //   return <div>Loading properties...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  const properties = [
    {
      id: 1,
      title: 'Seaside Serenity Villa',
      description:
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      price: 25000,
      propertyType: 'VILLA',
      configuration: '4 BHK',
      bedrooms: 3,
      bathrooms: 3,
      furnishing: 'FULLY_FURNISHED',
      rentFor: ['Bachelor'],
      photos: [
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      ],
      rentDetails: {
        availableFrom: '',
        deposit: 50000,
        rentAmount: 25000,
      },
      amenities: [
        'Balcony',
        'Wifi',
        'Gym',
        'Car Parking',
        '24/7 Water Supply',
        '24/7 Security',
        'Pet Friendly',
        'Couple Friendly',
      ],
      security: 50000,
      mainImage:
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
    },
    {
      id: 2,
      title: 'Seaside Serenity Villa',
      description:
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      price: 25000,
      mainImage:
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      propertyType: 'VILLA',
      configuration: '4 BHK',
      bedrooms: 3,
      bathrooms: 3,
      furnishing: 'FULLY_FURNISHED',
      rentFor: ['Bachelor'],
      photos: [
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      ],
      rentDetails: {
        availableFrom: '',
        deposit: 50000,
        rentAmount: 25000,
      },
      amenities: [
        'Balcony',
        'Wifi',
        'Gym',
        'Car Parking',
        '24/7 Water Supply',
        '24/7 Security',
        'Pet Friendly',
        'Couple Friendly',
      ],
      security: 50000,
    },
    {
      id: 3,
      title: 'Seaside Serenity Villa',
      description:
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      price: 25000,
      propertyType: 'VILLA',
      configuration: '4 BHK',
      bedrooms: 3,
      bathrooms: 3,
      furnishing: 'FULLY_FURNISHED',
      rentFor: ['Bachelor'],
      photos: [
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      ],
      mainImage:
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      rentDetails: {
        availableFrom: '',
        deposit: 50000,
        rentAmount: 25000,
      },
      amenities: [
        'Balcony',
        'Wifi',
        'Gym',
        'Car Parking',
        '24/7 Water Supply',
        '24/7 Security',
        'Pet Friendly',
        'Couple Friendly',
      ],
      security: 50000,
    },
    {
      id: 4,
      title: 'Seaside Serenity Villa',
      description:
        'hfjdfhsf fhfj dlfakdjfha lksdfhalsd fkjashf laksdj fhaldskufiqu hslkjdtg paidsyfpoisdfypo s lf hlasjfhlaskjf hlaksjf hlakjdfhla kjdfhlaskjdfhal kdfjhalskdfj halkfh alskfhlaksfjh lkafhlkjfhlsakfh sldakfjhlakjsfhs',
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      price: 25000,
      propertyType: 'VILLA',
      configuration: '4 BHK',
      bedrooms: 3,
      bathrooms: 3,
      furnishing: 'FULLY_FURNISHED',
      rentFor: ['Bachelor'],
      photos: [
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      ],
      rentDetails: {
        availableFrom: '',
        deposit: 50000,
        rentAmount: 25000,
      },
      mainImage:
        '/images/beautiful-red-brick-house-with-decorative-lights 1.png',
      amenities: [
        'Balcony',
        'Wifi',
        'Gym',
        'Car Parking',
        '24/7 Water Supply',
        '24/7 Security',
        'Pet Friendly',
        'Couple Friendly',
      ],
      security: 50000,
    },
  ];

  // const { filters } = useFilters();

  // const filteredProperties = properties.filter((property) => {
  //   // Filter by rent range
  //   if (property.rent < filters.rent[0] || property.rent > filters.rent[1]) {
  //     return false;
  //   }

  //   // Filter by property type
  //   if (filters.propertyType.length > 0) {
  //     const propertyType = property.propertyFeatures.find(
  //       (f) => f.icon === Home
  //     )?.label;
  //     if (!filters.propertyType.includes(propertyType || '')) {
  //       return false;
  //     }
  //   }

  //   // Filter by BHK type
  //   if (filters.bhkType.length > 0) {
  //     const bhkType = property.propertyFeatures.find(
  //       (f) => f.icon === Bed
  //     )?.label;
  //     if (!filters.bhkType.includes(bhkType || '')) {
  //       return false;
  //     }
  //   }

  //   // Filter by available for
  //   if (filters.availableFor.length > 0) {
  //     if (!filters.availableFor.includes(property.availableFor)) {
  //       return false;
  //     }
  //   }

  //   // Filter by furnishing
  //   if (filters.furnishing.length > 0) {
  //     if (!filters.furnishing.includes(property.furnishing)) {
  //       return false;
  //     }
  //   }

  //   // Filter by amenities
  //   if (filters.amenities.length > 0) {
  //     const hasAllSelectedAmenities = filters.amenities.every((amenity) =>
  //       property.amenities?.includes(amenity)
  //     );
  //     if (!hasAllSelectedAmenities) {
  //       return false;
  //     }
  //   }

  //   // Filter by parking
  //   if (filters.parking.length > 0) {
  //     const hasAllSelectedParking = filters.parking.every(
  //       (selectedParkingType) => property.parking.includes(selectedParkingType)
  //     );
  //     if (!hasAllSelectedParking) {
  //       return false;
  //     }
  //   }

  //   return true;
  // });

  return (
    <>
      <main className='px-4 my-2 sm:my-3 bg-[#FFFFFF]'>
        <PropertySearchHeader />
        <PropertyFilters onViewChange={(view) => setActiveView(view)} />

        <Tabs value={activeView} className='w-full'>
          <TabsContent value='list' className='mt-0'>
            <div className='flex flex-col gap-4 p-4'>
              {properties.map((property, index) => (
                <PropertyCard key={index} property={property} />
              ))}
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
                  {properties && properties.length > 0 ? (
                    properties.map((property, index) => (
                      <PropertyCard key={index} property={property} />
                    ))
                  ) : (
                    <div>No properties found.</div>
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
