'use client';

import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { useFilters } from '@/lib/context/FilterContext';

import PropertyFooter from '@/components/cards/PropertyFooter';
import { SmallPropertyCard } from '@/components/cards/SmallPropertyCard';
import MapComponent from '@/components/map/GoogleMap';
import NavbarDetailsPage from '@/components/Navbars/NavbarDetailsPage';
import { PropertySearchHeader } from '@/components/propertpage/PropertySearchHeader';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

import { PropertyPost } from '@/interfaces/Interface';
import store from '@/redux/store';

export default function DetailsPage() {
  const { filters, resetFilters } = useFilters();
  const [activeView, setActiveView] = useState('list');
  const [properties, setProperties] = useState<PropertyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapHeight, setMapHeight] = useState(500);
  const [navHeight, setNavHeight] = useState(120);
  const [page, setPage] = useState(1);

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

      const queryParams = new URLSearchParams();

      queryParams.append('minPrice', filters.rent[0].toString());
      queryParams.append('maxPrice', filters.rent[1].toString());
      queryParams.append('page', page.toString());

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
      console.log(url);

      const response = await axios.get(url);

      setProperties(response.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

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

  useEffect(() => {
    const updateHeight = () => {
      const navbarHeight = document.querySelector('.navbar')?.clientHeight || 0;
      const filterHeaderHeight =
        document.querySelector('.filter-header')?.clientHeight || 0;
      const totalOffset = navbarHeight + filterHeaderHeight + 20;
      setMapHeight(window.innerHeight - totalOffset);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Provider store={store}>
        <div className='fixed top-0 w-full bg-white z-10 navbar'>
          <NavbarDetailsPage stickyPage='property' />
          <PropertySearchHeader onViewChange={(view) => setActiveView(view)} />
        </div>
        <main className='mt-96 md:mt-36'>
          <div className='relative w-[95%] mx-auto'>
            <div className='flex flex-col md:flex-row'>
              {/* Left Side - Property List */}
              <div className='xl:pr-4 w-full xl:w-1/2 mt-4'>
                <div className='flex flex-col gap-4 mb-4'>
                  <h1 className='text-2xl font-semibold'>Top Results</h1>
                  <div className='flex flex-col gap-4 pr-4'>
                    {properties && properties.length > 0 ? (
                      properties.map((property, index) => (
                        <SmallPropertyCard
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
              </div>

              {/* Right Side - Sticky Map */}
              <div
                className='hidden xl:block w-1/2'
                style={{
                  position: 'sticky',
                  top: `140px`,
                  height: `${mapHeight}px`,
                }}
              >
                <div className='h-full rounded-lg relative overflow-hidden'>
                  <MapComponent properties={properties} />
                </div>
              </div>
            </div>
          </div>
          {/* Pagination */}
          <Pagination className='mt-4'>
            <PaginationContent>
              {[1, 2, 3, 4].map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    onClick={() => handlePageChange(p)}
                    isActive={p === page}
                    className={`${
                      p === page
                        ? 'bg-blue-500 text-white'
                        : 'border border-blue-500 text-blue-500'
                    } rounded-full w-10 h-10 flex items-center justify-center cursor-pointer`}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Ellipsis */}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              {/* Last Page */}
              {/* <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  className='border border-blue-500 text-blue-500 rounded-full w-10 h-10 flex items-center justify-center'
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem> */}

              {/* Next Button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(page + 1)}
                  className='border border-blue-500 text-blue-500 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'
                >
                  <ChevronRight />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <PropertyFooter />
        </main>
      </Provider>
    </>
  );
}
