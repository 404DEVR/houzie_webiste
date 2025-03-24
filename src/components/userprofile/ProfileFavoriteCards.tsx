'use client';

import axios from 'axios';
import {
  ArrowRight,
  Bath,
  Bed,
  Building2,
  Heart,
  Home,
  IndianRupee,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa6';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import {
  FinancialDetail,
  Listing,
  PropertyFeature,
} from '@/interfaces/Interface';

const transformString = (str: string | null | undefined) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const MyListings = () => {
  const toast = useCustomToast();
  const router = useRouter();
  const { auth } = useAuth();
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = `https://api.houzie.in/profile/favorites`;
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const listingsData = response.data.map((item: any) => item.listing);
      setFavoriteListings(listingsData);
      console.log(listingsData);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchListings();
  }, [auth?.accessToken, url]);

  const getPropertyFeatures = (listing: Listing): PropertyFeature[] => {
    const features: PropertyFeature[] = [];

    if (listing.bedrooms) {
      features.push({ icon: Bed, label: `${listing.bedrooms}-Bedroom` });
    }
    if (listing.bathrooms) {
      features.push({ icon: Bath, label: `${listing.bathrooms}-Bathroom` });
    }
    if (listing.balconies) {
      features.push({ icon: Building2, label: `${listing.balconies}-Balcony` });
    }
    features.push({
      icon: Home,
      label: transformString(listing.propertyType),
    });
    return features;
  };

  const getFinancialDetails = (listing: Listing): FinancialDetail[] => {
    const details: FinancialDetail[] = [];

    details.push({
      icon: IndianRupee,
      label: 'Rent',
      amount: `₹ ${listing.price}`,
    });
    details.push({
      icon: ShieldCheck,
      label: 'Security',
      amount: `₹ ${listing.security}`,
    });
    details.push({
      icon: KeyRound,
      label: 'Brokerage',
      amount: `₹ ${listing.brokerage}`,
    });

    return details;
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [iscreate, setIscreate] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFavorite = () => {
    setFavorites(!favorites);
  };

  const handleFavoriteClick = async (listingId: string) => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      if (isListingInFavorites(listingId)) {
        await removefavorites(listingId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removefavorites = async (id: string) => {
    try {
      setIsLoading(true); // Disable the button while loading
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const deleteUrl = `https://api.houzie.in/profile/favorites/${id}`;
      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        // Optimistically update the UI by removing the item from the state
        setFavoriteListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== id)
        );
        await fetchListings();
      }
    } catch (error: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    const accessToken = auth?.accessToken;

    if (!accessToken) {
      router.push(`/login?redirect=property/${id}`);
      return;
    }
  };

  const isListingInFavorites = (listingId: string) => {
    return favoriteListings.some((listing) => listing.id === listingId);
  };

  return (
    <div className='container mx-auto pb-8 pt-4 border px-2 sm:px-4 my-4 rounded-lg'>
      <h1 className='text-xl sm:text-2xl font-bold mb-4'>Favorites</h1>

      {isLoading ? (
        <p>Loading listings...</p>
      ) : Array.isArray(favoriteListings) && favoriteListings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className='space-y-4'>
          {Array.isArray(favoriteListings) &&
            favoriteListings.map((property) => {
              const propertyFeatures = getPropertyFeatures(property);
              const financialDetails = getFinancialDetails(property);
              const mainImageSrc = property.mainImage || '/svg/no-results.svg';

              return (
                <Card
                  key={property.id}
                  className='w-full mx-auto shadow-md rounded-2xl bg-[#eff6ff] border transition-all duration-300 overflow-hidden'
                >
                  <CardContent className='p-2 flex flex-col md:flex-row gap-4'>
                    <div className='w-full md:w-[350px] h-[180px] flex items-center justify-center'>
                      <div className='relative w-full h-full'>
                        <Image
                          src={property.mainImage || '/svg/no-results.svg'}
                          alt={property.title}
                          fill
                          className='object-cover rounded-2xl'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                        <Button
                          className='absolute top-0 right-3 p-2 md:hidden'
                          onClick={() => handleFavoriteClick(property.id)}
                        >
                          {isListingInFavorites(property.id) ? (
                            <FaHeart className='w-5 h-5 text-red-600' />
                          ) : (
                            <Heart className='w-5 h-5 text-red-600' />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className='w-full flex flex-col md:flex-row'>
                      <div className='md:w-[65%] pt-4 md:pt-10'>
                        <div className='flex flex-col justify-between items-center md:items-start mb-6'>
                          <h2 className='text-base sm:text-xl font-semibold mb-2'>
                            {property.title}
                          </h2>
                          <h3 className='text-xs font-normal line-clamp-2 w-[90%] text-center md:text-start'>
                            {property.description}
                          </h3>
                        </div>

                        <div className='flex flex-wrap items-center md:items-start justify-center md:justify-start mt-2 mb-4 md:mb-0'>
                          {propertyFeatures.map((feature, index) => (
                            <Badge
                              key={index}
                              variant='outline'
                              className=' border-none flex gap-1 justify-center items-center'
                            >
                              <feature.icon className='w-[14px] h-[14px]' />
                              <span className='font-medium text-xs'>
                                {feature.label}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className='flex flex-col items-center p-2 md:items-start'>
                        <div className='flex gap-6 mb-4 flex-wrap md:flex-nowrap '>
                          <div className='mb-1'>
                            <p className='text-gray-500 text-xs'>Rent</p>
                            <span className='text-black text-2xl font-semibold flex gap-2'>
                              <span>₹</span> {property.price}
                            </span>
                          </div>
                          <div className='mb-1'>
                            <p className='text-gray-500 text-xs'>Location:</p>
                            <span className='text-black text-2xl font-semibold'>
                              Gurgaon
                            </span>
                          </div>
                        </div>
                        <div className='flex gap-6 mb-0 flex-wrap md:flex-nowrap '>
                          <div className='mb-1'>
                            <p className='text-gray-500 text-xs'>Brokerage</p>
                            <span className='text-black text-2xl font-semibold flex gap-2'>
                              <span>₹</span> {property.brokerage}
                            </span>
                          </div>
                          <div className='mb-1'>
                            <p className='text-gray-500 text-xs'>Security</p>
                            <span className='text-black text-2xl font-semibold'>
                              <span>₹</span> {property.security}
                            </span>
                          </div>
                        </div>
                        {!iscreate && (
                          <div className='flex justify-end mt-auto pt-0'>
                            <Button
                              onClick={() => handleViewDetails(property.id)}
                              className='w-full lg:w-auto border bg-[#f5f5fa] rounded-lg px-6 text-[#60a5fa] hover:bg-[#e8e8f5] hover:text-[#60a5fa] transition-colors'
                            >
                              View Details
                              <ArrowRight />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='relative hidden md:block'>
                      <Button
                        className='absolute top-0 right-3 p-2'
                        onClick={() => handleFavoriteClick(property.id)}
                      >
                        {isListingInFavorites(property.id) ? (
                          <FaHeart className='w-5 h-5 text-red-600' />
                        ) : (
                          <Heart className='w-5 h-5 text-red-600' />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MyListings;
