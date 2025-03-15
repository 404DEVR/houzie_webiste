import axios from 'axios';
import { Bath, Bed, Copy, Home, InfoIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import ItemGrid from '@/components/cards/IconGrid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Listing, PropertyFeature } from '@/interfaces/Interface';
import { PropertyInfoProps } from '@/interfaces/PropsInterface';
interface propertyDetailsObject {
  label: string;
  value: string;
  hasIcon?: boolean;
}

interface propertyDetails {
  propertyDetailsObject;
}

const PropertyInfo = ({ propertyData }: PropertyInfoProps) => {
  const [favorites, setFavorites] = useState(false);
  const { auth } = useAuth();
  const toggleFavorite = () => setFavorites((prev) => !prev);
  const [showReadMore, setShowReadMore] = useState(false);
  const url = `https://api.houzie.in/profile/favorites`;
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maintainanceCharge, setMaintainanceCharge] = useState<number>();
  const toast = useCustomToast();
  const [currentUrl, setCurrentUrl] = useState('');

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

  const propertyFeatures: PropertyFeature[] = [
    ...(propertyData.bedrooms !== 0
      ? [{ icon: Bed, label: `${propertyData.bedrooms} Beds` }]
      : []),
    ...(propertyData.bathrooms !== 0
      ? [{ icon: Bath, label: `${propertyData.bathrooms} Baths` }]
      : []),
    ...(propertyData.propertyType
      ? [
          {
            icon: Home,
            label: transformString(propertyData.propertyType),
          },
        ]
      : []),
  ];

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `${Math.floor(price / 1000)}K`;
    }
    return price.toString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  function bhkToNumeric(bhkType: string): string {
    switch (bhkType) {
      case 'ONE_RK':
        return '1 RK';
      case 'ONE_BHK':
        return '1 BHK';
      case 'TWO_BHK':
        return '2 BHK';
      case 'THREE_BHK':
        return '3 BHK';
      case 'FOUR_BHK':
        return '4 BHK';
      case 'FOUR_PLUS_BHK':
        return '4+ BHK';
      case 'ONE_ROOM':
        return '1 Room';
      default:
        return 'Unknown';
    }
  }

  const getPropertyDetails = (propertyType: string) => {
    switch (propertyType) {
      case 'BUILDER_FLOOR':
        return [
          [
            { label: 'Bedroom', value: propertyData.bedrooms },
            { label: 'Balcony', value: propertyData.balconies },
            {
              label: 'Available From',
              value: formatDate(propertyData.availableFrom),
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Bathroom',
              value: propertyData.bathrooms,
              hasIcon: false,
            },
            {
              label: 'Floor Number',
              value: `${propertyData.floorNumber} Out Of ${propertyData.totalFloors}`,
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Furnishing',
              value: transformString(propertyData.furnishing),
              hasIcon: true,
            },
            {
              label: '4 Wheeler Parking',
              value: transformString(
                propertyData.amenities.includes('FOUR_WHEELER_PARKING')
                  ? 'Included'
                  : 'Included'
              ),
              hasIcon: false,
            },
            {
              label: 'Available for',
              value: transformString(propertyData.preferredTenant),
              hasIcon: false,
            },
          ],
        ];
      case 'FLAT_APARTMENT':
        return [
          [
            { label: 'Bedroom', value: propertyData.bedrooms },
            { label: 'Balcony', value: propertyData.balconies },
            {
              label: 'Available From',
              value: formatDate(propertyData.availableFrom),
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Bathroom',
              value: propertyData.bathrooms,
              hasIcon: false,
            },
            {
              label: 'Floor Number',
              value: `${propertyData.floorNumber} Out Of ${propertyData.totalFloors}`,
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Furnishing',
              value: transformString(propertyData.furnishing),
              hasIcon: true,
            },
            {
              label: '4 Wheeler Parking',
              value: transformString(
                propertyData.amenities.includes('FOUR_WHEELER_PARKING')
                  ? 'Included'
                  : 'Included'
              ),
              hasIcon: false,
            },
            {
              label: 'Available for',
              value: transformString(propertyData.preferredTenant),
              hasIcon: false,
            },
          ],
        ];
      case 'VILLA':
        return [
          [
            { label: 'Bedroom', value: propertyData.bedrooms },
            { label: 'Balcony', value: propertyData.balconies },
            {
              label: 'Available From',
              value: formatDate(propertyData.availableFrom),
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Bathroom',
              value: propertyData.bathrooms,
              hasIcon: false,
            },
            {
              label: 'Floor Number',
              value: `${propertyData.floorNumber} Out Of ${propertyData.totalFloors}`,
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Furnishing',
              value: transformString(propertyData.furnishing),
              hasIcon: true,
            },
            {
              label: 'Meals',
              value: propertyData.amenities.includes('MEALS')
                ? 'Included'
                : 'Not Included',
              hasIcon: false,
            },

            {
              label: '2 Wheeler Parking',
              value: propertyData.amenities.includes('TWO_WHEELER_PARKING')
                ? 'Included'
                : 'Included',
              hasIcon: false,
            },
          ],
        ];
      case 'CO_LIVING':
        return [
          [
            {
              label: 'AC',
              value: propertyData.furnishingExtras.includes('AC')
                ? 'Included'
                : 'Not Included',
            },
            {
              label: '2 Wheeler Parking',
              value: propertyData.features.includes('TWO_WHEELER_PARKING')
                ? 'Included'
                : 'Not Included',
            },
            {
              label: 'Available From',
              value: formatDate(propertyData.availableFrom),
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Room Type',
              value: bhkToNumeric(propertyData.roomType),
              hasIcon: false,
            },
            {
              label: '4 Wheeler Parking',
              value: propertyData.amenities.includes('FOUR_WHEELER_PARKING')
                ? 'Included'
                : 'Included',

              hasIcon: false,
            },
          ],
          [
            {
              label: 'Furnishing',
              value: propertyData.furnishing.includes('NONE')
                ? 'Unfurnished'
                : transformString(propertyData.furnishing),
              hasIcon: true,
            },
            {
              label: 'Preferred Gender',
              value: transformString(
                propertyData.preferredGender && propertyData.preferredGender[0]
              ),
              hasIcon: false,
            },
            {
              label: 'Meals',
              value: propertyData.amenities.includes('MEALS')
                ? 'Included'
                : 'Not Included',
              hasIcon: false,
            },
          ],
        ];
      case 'PG':
        return [
          [
            {
              label: 'AC',
              value: propertyData.furnishingExtras.includes('AC')
                ? 'Included'
                : 'Not Included',
            },
            {
              label: '2 Wheeler Parking',
              value: propertyData.features.includes('TWO_WHEELER_PARKING')
                ? 'Included'
                : 'Not Included',
            },
            {
              label: 'Available From',
              value: formatDate(propertyData.availableFrom),
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Room Type',
              value: transformString(propertyData.roomType),
              hasIcon: false,
            },
            {
              label: '4 Wheeler Parking',
              value: propertyData.amenities.includes('FOUR_WHEELER_PARKING')
                ? 'Included'
                : 'Included',

              hasIcon: false,
            },
          ],
          [
            {
              label: 'Furnishing',
              value: propertyData.furnishing.includes('NONE')
                ? 'Unfurnished'
                : transformString(propertyData.furnishing),
              hasIcon: true,
            },
            {
              label: 'Preferred Gender',
              value: transformString(
                propertyData.preferredGender && propertyData.preferredGender[0]
              ),
              hasIcon: false,
            },
            {
              label: 'Meals',
              value: propertyData.amenities.includes('MEALS')
                ? 'Included'
                : 'Not Included',
              hasIcon: false,
            },
          ],
        ];
      default:
        return [
          [
            { label: 'Bedroom', value: propertyData.bedrooms },
            { label: 'Balcony', value: propertyData.balconies },
            {
              label: 'Available From',
              value: formatDate(propertyData.availableFrom),
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Bathroom',
              value: propertyData.bathrooms,
              hasIcon: false,
            },
            {
              label: 'Floor Number',
              value: `${propertyData.floorNumber} Out Of ${propertyData.totalFloors}`,
              hasIcon: false,
            },
          ],
          [
            {
              label: 'Furnishing',
              value: transformString(propertyData.furnishing),
              hasIcon: true,
            },
            {
              label: 'Preferred Gender',
              value: transformString(
                propertyData.preferredGender && propertyData.preferredGender[0]
              ),
              hasIcon: false,
            },
            {
              label: 'Available for',
              value: transformString(propertyData.preferredTenant),
              hasIcon: false,
            },
          ],
        ];
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
            id: propertyData.id,
            title: propertyData.title,
            description: propertyData.description,
            location: {
              id: '',
              city: propertyData.location.city,
              state: propertyData.location.state,
              country: '',
              latitude: 0,
              longitude: 0,
            },
            brokerId: '',
            isActive: false,
            photos: propertyData.photos,
            mainImage: propertyData.mainImage,
            bathrooms: propertyData.bathrooms,
            bedrooms: propertyData.bedrooms,
            balconies: 0,
            propertyType: propertyData.propertyType,
            views: 0,
            price: propertyData.price,
            security: propertyData.security,
            brokerage: propertyData.brokerage,
            isNegotiable: false,
            lockInPeriod: '',
            availableFrom: propertyData.availableFrom,
            configuration: '',
            floorNumber: '',
            totalFloors: 0,
            maintenanceCharges: propertyData.maintenanceCharges,
            isMaintenanceIncluded: propertyData.isMaintenanceIncluded,
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

  useEffect(() => {
    if (propertyData?.id) {
      setCurrentUrl(`${window.location.origin}/property/${propertyData.id}`);
    }
  }, [propertyData?.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.info({
        title: 'Copied!',
        description: 'Link copied to clipboard.',
      });
    } catch (err) {
      toast.error({
        title: 'Copy failed',
        description: 'Failed to copy link. Please try again.',
      });
    }
  };

  return (
    <div className='max-w-4xl mx-auto '>
      {/* Property Header */}
      <div className='bg-[#eff5ff] border rounded-lg p-6 shadow-sm'>
        <div className='flex justify-between items-center mb-4 p-2'>
          <h1 className='text-3xl sm:text-4xl font-semibold'>
            {propertyData.title}
          </h1>
          <div className='flex items-center gap-4'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size='custom'
                  className='flex-1 sm:flex-initial items-center gap-2  text-[#3b8ff6] sm:min-w-fit py-2 md:px-4'
                >
                  <Image
                    src='/svg/Share.svg'
                    alt='public/svg/Share.svg'
                    width={20}
                    height={20}
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view this.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex items-center space-x-2'>
                  <div className='grid flex-1 gap-2'>
                    <Label htmlFor='link' className='sr-only'>
                      Link
                    </Label>
                    <Input id='link' value={currentUrl} readOnly />
                  </div>
                  <Button
                    type='button'
                    size='sm'
                    className='px-3'
                    onClick={copyToClipboard}
                  >
                    <span className='sr-only'>Copy</span>
                    <Copy />
                  </Button>
                </div>
                <DialogFooter className='sm:justify-start'>
                  <DialogClose asChild>
                    <Button type='button'>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              className='p-2'
              onClick={() => handleFavoriteClick(propertyData.id)}
            >
              {isListingInFavorites(propertyData.id) ? (
                <Image
                  src='/svg/heart.svg'
                  alt='/svg/heart.svg'
                  width={25}
                  height={25}
                />
              ) : (
                <Image
                  src='/svg/heart fill.svg'
                  alt='public/svg/heart fill.svg'
                  width={25}
                  height={25}
                />
              )}
            </Button>
          </div>
        </div>
        <div className='flex flex-wrap items-center md:items-start justify-start mt-2 mb-8'>
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
        <div className='flex flex-wrap gap-6 gap-y-4 text-lg font-medium text-gray-700 mt-4'>
          <div className='flex gap-2 justify-start items-center'>
            <h1 className='text-sm font-normal'>Rent:</h1>
            <span className='font-bold text-black'>
              ₹ {formatPrice(propertyData.price)}
            </span>
          </div>
          <div className='flex gap-2 justify-start items-center'>
            <h1 className='text-sm font-normal'>Brokerage:</h1>
            <span className='font-bold text-black'>
              ₹ {formatPrice(propertyData.brokerage)}
            </span>
          </div>
          <div className='flex gap-2 justify-start items-center'>
            <h1 className='text-sm font-normal'>Security:</h1>
            <span className='font-bold text-black'>
              ₹ {formatPrice(propertyData.security)}
            </span>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-y-4 text-lg font-medium text-gray-700 mt-4'>
          {maintainanceCharge && (
            <div className='flex items-center justify-start gap-1'>
              <div className='flex justify-start items-center'>
                <h1 className='text-sm font-normal'>Maintenance</h1>
                <span className='text-[10px] mt-1'>/person:</span>
              </div>
              <span className='font-bold text-black ml-2'>
                ₹ {formatPrice(maintainanceCharge)}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AiOutlineInfoCircle className='text-gray-500 w-5 h-5 ml-1 cursor-pointer' />
                  </TooltipTrigger>
                  <TooltipContent
                    side='bottom'
                    align='start'
                    className='rounded-xl p-4 shadow-lg border border-gray-200 bg-white'
                  >
                    <div className='space-y-2'>
                      <p className='text-lg font-medium'>
                        Expenses <span className='text-sm'>/person</span>
                      </p>
                      <ul className='space-y-1 text-gray-600 text-sm'>
                        <li>
                          Maid: ₹{propertyData.maidChargesPerPerson || 0}/-
                        </li>
                        <li>
                          Wifi: ₹{propertyData.wifiChargesPerPerson || 0}/-
                        </li>
                        <li>
                          Cook: ₹{propertyData.cookChargesPerPerson || 0}/-
                        </li>
                        <li>
                          Any Other: ₹
                          {propertyData.otherMaintenanceCharges || 0}/-
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>

      {/* Property Overview */}
      <div className=' bg-[#eff5ff] border rounded-xl mt-7 p-6'>
        <div className='flex flex-col gap-5 p-2'>
          <h2 className='font-semibold text-3xl sm:text-4xl leading-9'>
            Property Overview
          </h2>

          <div className='grid grid-cols-2 sm:flex sm:items-start gap-4 sm:justify-between sm:flex-1 w-full sm:mt-6'>
            {getPropertyDetails(propertyData.propertyType).map(
              (column, columnIndex) => (
                <div
                  key={columnIndex}
                  className='inline-flex flex-col items-start gap-[30px]'
                >
                  {column.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className='flex flex-col items-start'
                    >
                      <div className='text-[#6f6f6f] text-nowrap text-sm leading-[21px]'>
                        {detail.label}
                      </div>
                      <div className='flex text-nowrap items-center gap-1.5 font-medium text-black text-base leading-6'>
                        {detail.value}
                        {propertyData.furnishingExtras &&
                          propertyData.furnishingExtras.length > 0 &&
                          detail.hasIcon && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className='w-6 h-6 cursor-pointer' />
                                </TooltipTrigger>
                                <TooltipContent side='right'>
                                  <div className='space-y-4 sm:space-y-6'>
                                    <ItemGrid
                                      title='Furnishings'
                                      data={propertyData.furnishingExtras}
                                      type='furnishing'
                                    />
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
