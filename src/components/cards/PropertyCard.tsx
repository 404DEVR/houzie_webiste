import axios from 'axios';
import { ArrowRight, Bath, Bed, Heart, Home, Lock, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

import {
  FinancialDetails,
  Listing,
  PropertyFeature,
} from '@/interfaces/Interface';
import { PropertyCardProps } from '@/interfaces/PropsInterface';
import { FaHeart } from 'react-icons/fa6';

export function PropertyCard({
  property,
  iscreate,
  loadImage,
}: PropertyCardProps) {
  const toast = useCustomToast();
  const { auth } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mainImageSrc, setMainImageSrc] = useState<string | null>(null);
  const transformString = (str: string | null | undefined) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const toggleFavorite = () => setFavorites((prev) => !prev);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

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
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchListings();
  }, [auth?.accessToken, url]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setShowReadMore(
          textRef.current.scrollHeight > textRef.current.clientHeight
        );
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [property.description]);

  useEffect(() => {
    async function loadMainImage() {
      if (property.mainImage) {
        try {
          const cachedUrl = await loadImage(property.mainImage);
          setMainImageSrc(cachedUrl);
        } catch (error) {
          setMainImageSrc('/svg/no-results.svg');
        }
      }
    }
    loadMainImage();
  }, [property.mainImage, loadImage]);

  const propertyFeatures: PropertyFeature[] = [
    ...(property.bedrooms !== 0
      ? [{ icon: Bed, label: `${property.bedrooms} Beds` }]
      : []),
    ...(property.bathrooms !== 0
      ? [{ icon: Bath, label: `${property.bathrooms} Baths` }]
      : []),
    ...(property.propertyType
      ? [
          {
            icon: Home,
            label: transformString(property.propertyType),
          },
        ]
      : []),
  ];

  const financialDetails: FinancialDetails[] = [
    ...(property.price
      ? [{ icon: Wallet, label: 'Rent', amount: `₹${property.price}` }]
      : []),
    ...(property.security
      ? [
          {
            icon: Lock,
            label: 'Security Deposit',
            amount: `₹${property.security}`,
          },
        ]
      : []),
    ...(property.brokerage
      ? [{ icon: Wallet, label: 'Brokerage', amount: `₹${property.brokerage}` }]
      : []),
  ];

  if (property.maintenanceCharges > 0) {
    financialDetails.push({
      icon: Wallet,
      label: 'Maintenance',
      amount: `₹${property.maintenanceCharges} ${
        property.isMaintenanceIncluded ? '(Included)' : '(Extra)'
      }`,
    });
  }

  const handleViewDetails = async (id: string) => {
    const accessToken = auth?.accessToken;

    if (!accessToken) {
      toast.error({
        title: 'Unauthorized',
        description: 'You are not authorized.',
      });
      router.push(`/login?redirect=property/${id}`);
      return;
    }

    try {
      await axios.post(
        `https://api.houzie.in/profile/visited/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      router.push(`/property/${id}`);
    } catch (error: any) {
      toast.error({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to record visit. Try again.',
      });
    }
  };

  const removefavorites = async (id: string) => {
    try {
      setIsLoading(true);
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
        toast.success({
          title: 'Success',
          description: 'Property removed from favorites.',
        });

        setFavoriteListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== id)
        );
        await fetchListings();
      } else {
        toast.error({
          title: 'Failed to Remove',
          description:
            'Failed to remove property from favorites. Please Check Your Network Connection',
        });
      }
    } catch (error: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isListingInFavorites = (listingId: string) => {
    return favoriteListings.some((listing) => listing.id === listingId);
  };

  const addfavorites = async (id: string) => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await axios.post(
        `https://api.houzie.in/profile/favorites/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFavoriteListings((prevListings) => {
        if (!prevListings.some((listing) => listing.id === id)) {
          const newListing: Listing = {
            id: property.id,
            title: property.title,
            description: property.description,
            location: {
              id: '',
              city: property.location.city,
              state: property.location.state,
              country: '',
              latitude: 0,
              longitude: 0,
            },
            brokerId: '',
            isActive: false,
            photos: property.photos,
            mainImage: property.mainImage,
            bathrooms: property.bathrooms,
            bedrooms: property.bedrooms,
            balconies: 0,
            propertyType: property.propertyType,
            views: 0,
            price: property.price,
            security: property.security,
            brokerage: property.brokerage,
            isNegotiable: false,
            lockInPeriod: '',
            availableFrom: property.availableFrom,
            configuration: '',
            floorNumber: '',
            totalFloors: 0,
            maintenanceCharges: property.maintenanceCharges,
            isMaintenanceIncluded: property.isMaintenanceIncluded,
            roomType: '',
            sharingType: '',
            unitsAvailable: '',
            roomSize: '',
            amenities: [],
            features: [],
            furnishing: '',
            furnishingExtras: [],
            preferredTenant: '',
          };

          return [...prevListings, newListing];
        }
        return prevListings;
      });

      toast.success({
        title: 'Success',
        description: 'Property Added to favorites.',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteClick = async (listingId: string) => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      if (isListingInFavorites(listingId)) {
        await removefavorites(listingId);
      } else {
        await addfavorites(listingId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className='w-full mx-auto shadow-md rounded-2xl bg-[#eff6ff] border transition-all duration-300 overflow-hidden'>
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
              className='absolute top-0 right-3 p-2 xl:hidden'
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
          <div className='md:w-[60%] pt-4 md:pt-10'>
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
                  <span className='font-medium text-xs'>{feature.label}</span>
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
        <div className='relative hidden xl:block'>
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
}
