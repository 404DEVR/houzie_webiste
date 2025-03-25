import axios from 'axios';
import { ArrowRight, Bath, Bed, Heart, Home, Lock, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaHeart } from 'react-icons/fa6';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import {
  FinancialDetails,
  Listing,
  PropertyFeature,
} from '@/interfaces/Interface';
import { PropertyCardProps } from '@/interfaces/PropsInterface';

export function SmallPropertyCard({
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
  const toggleFavorite = () => setFavorites((prev) => !prev);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = `https://api.houzie.in/profile/favorites`;

  const transformString = (str: string | null | undefined) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
    ...(property.bedrooms !== 0 && property.bedrooms !== null
      ? [{ icon: Bed, label: `${property.bedrooms} Beds` }]
      : []),
    ...(property.bathrooms !== 0 && property.bathrooms !== null
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
      console.log('error');
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteClick = async (listingId: string) => {
    if (!auth?.accessToken) {
      router.push(`/login?redirect=property`);
      return;
    }
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

  const formatPrice = (price) => {
    if (price >= 1_00_00_000) {
      return `${(price / 1_00_00_000).toFixed(1)} Cr`;
    } else if (price >= 1_00_000) {
      return `${(price / 1_00_000).toFixed(1)} L`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`;
    }
    return price.toString();
  };

  return (
    <Card className='w-full mx-auto shadow-md rounded-2xl bg-[#eff6ff] border transition-all duration-300 overflow-hidden'>
      <CardContent className='p-2 flex flex-col md:flex-row gap-4 md:h-[260px] md:max-h-[260px]'>
        <div className='w-full md:w-[550px] md:h-[260px] flex flex-col'>
          <div className='relative w-[300px] h-[190px] border rounded-2xl mx-auto md:mx-0'>
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
          <div className='flex-1 p-1'>
            <div className='flex flex-col justify-between items-center md:items-start'>
              <h2 className='text-base sm:text-xl text-start font-semibold mb-1 line-clamp-1'>
                {property.title}
              </h2>
              <div className='flex gap-4 items-center justify-start'>
                {propertyFeatures.map((feature, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='border-none flex gap-1 p-0 justify-center items-center'
                  >
                    <feature.icon className='w-[14px] h-[14px]' />
                    <span className='font-medium text-xs text-nowrap'>
                      {feature.label}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col md:flex-row h-full'>
          <div className=' flex flex-col h-full justify-between items-start md:py-2'>
            <div className='md:w-full pl-8 h-full '>
              <div className='flex gap-6 mb-2 flex-wrap md:flex-nowrap '>
                <div className='mb-1'>
                  <p className='text-gray-500 text-xs'>Rent</p>
                  <span className='text-black text-2xl font-semibold flex gap-2'>
                    <span>₹</span> {formatPrice(property.price)}
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
                    <span>₹</span> {formatPrice(property.brokerage)}
                  </span>
                </div>
                <div className='mb-1'>
                  <p className='text-gray-500 text-xs'>Security</p>
                  <span className='text-black text-2xl font-semibold'>
                    <span>₹</span> {formatPrice(property.security)}
                  </span>
                </div>
              </div>
              <h3 className='text-xs font-normal line-clamp-2 w-[90%] text-start mt-4'>
                {property.description}
              </h3>
            </div>
            <div className='flex flex-col items-center mt-4 md:items-start pl-8'>
              {!iscreate && (
                <div className=' flex justify-end pt-0'>
                  <Button
                    onClick={() => handleViewDetails(property.id)}
                    className='w-full lg:w-auto border-2 font-semibold bg-[#f5f5fa] shadow-md rounded-lg px-6 text-[#60a5fa] hover:bg-[#e8e8f5] hover:text-[#60a5fa] transition-colors'
                  >
                    View Details
                    <ArrowRight />
                  </Button>
                </div>
              )}
            </div>
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
