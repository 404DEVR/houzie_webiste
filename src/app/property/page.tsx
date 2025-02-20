'use client';

import axios from 'axios';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { useFilters } from '@/lib/context/FilterContext';

import { PropertyCard } from '@/components/cards/PropertyCard';
import LocalitiesGrid from '@/components/imagegrids/LocalitiesGrid';
// Import PropertyComponent
import { PropertyFilters } from '@/components/propertpage/PropertyFilters';
import { PropertySearchHeader } from '@/components/propertpage/PropertySearchHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import store from '@/redux/store';

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
  const { filters, resetFilters } = useFilters(); // Get resetFilters from the hook
  const [activeView, setActiveView] = useState('list');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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
        return '/svg/no-results.svg';
      }
    },
    [imageCache]
  );

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Build the query string from the filters
      const queryParams = new URLSearchParams();

      //Price Range
      queryParams.append('minPrice', filters.rent[0].toString());
      queryParams.append('maxPrice', filters.rent[1].toString());

      if (filters.propertyType && filters.propertyType.length > 0) {
        queryParams.append('propertyType', filters.propertyType.join(','));
      }
      if (filters.bhkType && filters.bhkType.length > 0) {
        queryParams.append('bhkType', filters.bhkType.join(','));
      }
      if (filters.availableFor && filters.availableFor.length > 0) {
        queryParams.append('availableFor', filters.availableFor.join(','));
      }
      if (filters.furnishing && filters.furnishing.length > 0) {
        queryParams.append('furnishing', filters.furnishing.join(','));
      }
      if (filters.amenities && filters.amenities.length > 0) {
        queryParams.append('amenities', filters.amenities.join(','));
      }
      if (filters.parking && filters.parking.length > 0) {
        queryParams.append('parking', filters.parking.join(','));
      }

      const url = `https://api.houzie.in/listings?${queryParams.toString()}`;

      const response = await axios.get(url);

      setProperties(response.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]); //Now this will trigger when ANY filter changes

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
          resetFilters();
        }}
        className='px-4 py-2 bg-[#42A4AE] text-white'
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <Provider store={store}>
      <main className='px-4 my-2 sm:my-3 bg-[#FFFFFF]'>
        <PropertySearchHeader />

        <div className='flex flex-col md:flex-row gap-4'>
          {/* Filter Component (visible on larger screens) */}
          <aside className='w-full md:w-[25%]'>
            <PropertyFilters onViewChange={(view) => setActiveView(view)} />
          </aside>

          {/* Property Listings */}
          <div className='w-full md:w-[75%]'>
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
                <div className='flex flex-col gap-4 p-4 '>
                  <div className='w-full  rounded-lg '>
                    <div className='h-[400px] w-[60%] mx-auto rounded-lg relative overflow-hidden'>
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

                  <div className='w-full pr-4'>
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

                  {/* <div className='hidden xl:block w-full lg:w-1/3 rounded-lg sticky top-0'>
                    <div className='h-[400px] w-full rounded-lg relative overflow-hidden'>
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
                  </div> */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <LocalitiesGrid normal={true} />
      </main>
    </Provider>
  );
}
