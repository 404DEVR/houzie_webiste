import {
  Bath,
  Bed,
  Bike,
  Building,
  Building2,
  Calendar,
  Home,
  InfoIcon,
  Snowflake,
  Sofa,
  User,
  Users,
  Utensils,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import ItemGrid from '@/components/cards/IconGrid';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { PropertyFeature } from '@/interfaces/Interface';
import { PropertyInfoProps } from '@/interfaces/PropsInterface';
interface propertyDetailsObject {
  label: string;
  value: string;
  hasIcon?: boolean;
  icon?: JSX.Element;
}

interface propertyDetails {
  propertyDetailsObject;
}

const PropertyInfo = ({ propertyData }: PropertyInfoProps) => {
  const { auth } = useAuth();
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

  const getPropertyDetails = (
    propertyType: string
  ): propertyDetailsObject[] => {
    const baseDetails: propertyDetailsObject[] = [
      {
        label: 'Bedroom',
        value: `${String(propertyData.bedrooms)} Bedrooms`,
        icon: <Bed size={20} />,
        hasIcon: false,
      },
      {
        label: 'Balcony',
        value: `${String(propertyData.balconies)} Balconies`,
        icon: <Building2 size={20} />,
        hasIcon: false,
      },
      {
        label: 'Bathroom',
        value: `${String(propertyData.bathrooms)} Bathrooms`,
        icon: <Bath size={20} />,
        hasIcon: false,
      },
      {
        label: 'Type',
        value: `${transformString(propertyData.propertyType)}`,
        icon: <Building size={20} />,
        hasIcon: false,
      },
      {
        label: 'Furnishing',
        value: transformString(propertyData.furnishing),
        icon: <Sofa size={20} />,
        hasIcon: true,
      },

      {
        label: 'Available From',
        value: formatDate(propertyData.availableFrom),
        icon: <Calendar size={20} />,
        hasIcon: false,
      },
    ];

    let additionalDetails: propertyDetailsObject[] = [];

    switch (propertyType) {
      case 'BUILDER_FLOOR':
        additionalDetails = [
          {
            label: 'Floor Number',
            value: `${propertyData.floorNumber} Out Of ${propertyData.totalFloors}`,
            icon: <Building size={20} />,
            hasIcon: false,
          },
          {
            label: 'Available for',
            value: transformString(propertyData.preferredTenant),
            icon: <User size={20} />,
            hasIcon: false,
          },
        ];
        break;

      case 'VILLA':
        additionalDetails = [
          {
            label: 'Meals',
            value: propertyData.amenities.includes('MEALS')
              ? 'Included'
              : 'Not Included',
            icon: <Utensils size={20} />,
            hasIcon: false,
          },
          {
            label: '2 Wheeler Parking',
            value: propertyData.amenities.includes('TWO_WHEELER_PARKING')
              ? 'Included'
              : 'Not Included',
            icon: <Bike size={20} />,
            hasIcon: false,
          },
        ];
        break;

      case 'CO_LIVING':
        additionalDetails = [
          {
            label: 'AC',
            value: propertyData.furnishingExtras.includes('AC')
              ? 'Included'
              : 'Not Included',
            icon: <Snowflake size={20} />,
            hasIcon: true,
          },
          {
            label: 'Preferred Gender',
            value: transformString(propertyData.preferredGender?.[0] || 'Any'),
            icon: <Users size={20} />,
            hasIcon: false,
          },
        ];
        break;

      case 'PG':
        additionalDetails = [
          {
            label: 'Meals',
            value: propertyData.amenities.includes('MEALS')
              ? 'Included'
              : 'Not Included',
            icon: <Utensils size={20} />,
            hasIcon: false,
          },
          {
            label: 'Preferred Gender',
            value: transformString(propertyData.preferredGender?.[0] || 'Any'),
            icon: <Users size={20} />,
            hasIcon: false,
          },
        ];
        break;

      default:
        additionalDetails = [];
    }

    return [...baseDetails, ...additionalDetails];
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
    <div className=' py-2 shadow-sm'>
      <div className='flex justify-start items-center gap-12 mb-4 py-2'>
        <div className='flex gap-2 justify-start items-center'>
          <h1 className='text-lg font-medium text-[#4a4a4a]'>Rent:</h1>
          <span className='font-semibold text-4xl text-[#3b8ff6]'>
            ₹ {formatPrice(propertyData.price)}
          </span>
        </div>
        <div className='flex gap-2 justify-start items-center'>
          <h1 className='text-lg font-medium text-[#4a4a4a]'>Brokerage:</h1>
          <span className='font-semibold text-4xl text-[#3b8ff6]'>
            ₹ {formatPrice(propertyData.brokerage)}
          </span>
        </div>
        <div className='flex gap-2 justify-start items-center'>
          <h1 className='text-lg font-medium text-[#4a4a4a]'>Security:</h1>
          <span className='font-semibold text-4xl text-[#3b8ff6]'>
            ₹ {formatPrice(propertyData.security)}
          </span>
        </div>
        {maintainanceCharge && (
          <div className='flex items-center justify-start gap-1'>
            <div className='flex justify-start items-center'>
              <h1 className='text-lg font-medium text-[#4a4a4a]'>
                Maintenance
              </h1>
              <span className='text-[10px] mt-1 text-[#4a4a4a]'>/person:</span>
            </div>
            <span className='font-semibold text-4xl text-[#3b8ff6]'>
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
                      <li>Maid: ₹{propertyData.maidChargesPerPerson || 0}/-</li>
                      <li>Wifi: ₹{propertyData.wifiChargesPerPerson || 0}/-</li>
                      <li>Cook: ₹{propertyData.cookChargesPerPerson || 0}/-</li>
                      <li>
                        Any Other: ₹{propertyData.otherMaintenanceCharges || 0}
                        /-
                      </li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <div className='flex flex-col items-center md:items-start border-b pb-4 border-gray-200 w-full justify-start my-2'>
        <h1 className='text-2xl font-medium text-[#4a4a4a]'>Description</h1>
        <p className='text-base text-[#a2a6a9]'>{propertyData.description}</p>
      </div>
      <div className='border-b border-gray-200 pb-4'>
        <h1 className='text-2xl font-medium text-[#4a4a4a]'>Overview</h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          {getPropertyDetails(propertyData.propertyType).map(
            (detail, index) => (
              <div key={index} className='flex items-center py-3'>
                <div className='p-4 border border-black rounded-lg mr-2'>
                  {detail.icon}
                </div>
                <div>
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
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
