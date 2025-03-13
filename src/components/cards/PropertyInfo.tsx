import React, { useEffect, useState } from 'react';
import { FaBed, FaBath } from 'react-icons/fa';
import { IoIosShareAlt } from 'react-icons/io';
import { AiOutlineHeart, AiOutlineInfoCircle } from 'react-icons/ai';
import { PropertyInfoProps } from '@/interfaces/PropsInterface';
import { PropertyFeature } from '@/interfaces/Interface';
import { Bath, Bed, Home, InfoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ItemGrid from '@/components/cards/IconGrid';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PropertyInfo = ({ propertyData }: PropertyInfoProps) => {
  const [maintainanceCharge, setMaintainanceCharge] = useState<number>();
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

  const propertyDetails = [
    [
      { label: 'Bedroom', value: propertyData.bedrooms },
      { label: 'Balcony', value: propertyData.balconies },
      {
        label: 'Available From',
        value: formatDate(propertyData.availableFrom),
      },
    ],
    [
      { label: 'Bathroom', value: propertyData.bathrooms },
      {
        label: 'Floor Number',
        value: propertyData.floorNumber,
      },
    ],
    [
      {
        label: 'Furnishing',
        value: transformString(propertyData.furnishing),
        hasIcon: true,
      },
      {
        label: 'Proffered Gender',
        value: propertyData.preferredTenant,
      },
      {
        label: 'Available for',
        value: transformString(propertyData.preferredTenant),
      },
    ],
  ];

  useEffect(() => {
    if (
      propertyData?.maidChargesPerPerson &&
      propertyData?.otherMaintenanceCharges &&
      propertyData?.wifiChargesPerPerson &&
      propertyData?.cookChargesPerPerson
    ) {
      const totalmaintainance =
        propertyData?.maidChargesPerPerson +
        propertyData?.otherMaintenanceCharges +
        propertyData?.wifiChargesPerPerson +
        propertyData?.cookChargesPerPerson;
      setMaintainanceCharge(totalmaintainance);
    }
  });
  return (
    <div className='max-w-4xl mx-auto '>
      {/* Property Header */}
      <div className='bg-[#eff5ff] border rounded-lg p-6 shadow-sm'>
        <div className='flex justify-between items-center mb-4 p-2'>
          <h1 className='text-4xl font-bold'>{propertyData.title}</h1>
          <div className='flex items-center gap-4'>
            <IoIosShareAlt className='text-blue-500 w-6 h-6 cursor-pointer' />
            <AiOutlineHeart className='text-red-500 w-6 h-6 cursor-pointer' />
          </div>
        </div>
        <div className='flex flex-wrap items-center md:items-start justify-center md:justify-start mt-2 mb-8'>
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
        <div className='flex gap-6 gap-y-4 text-lg font-medium text-gray-700 mt-4'>
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
          <h2 className='font-semibold text-4xl leading-9'>
            Property Overview
          </h2>

          <div className='flex items-start justify-between flex-1 w-full mt-6'>
            {propertyDetails.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className='inline-flex flex-col items-start gap-[30px]'
              >
                {column.map((detail, detailIndex) => (
                  <div key={detailIndex} className='flex flex-col items-start'>
                    <div className='text-[#6f6f6f] text-sm leading-[21px]'>
                      {detail.label}
                    </div>
                    <div className='flex items-center gap-1.5 font-medium text-black text-base leading-6'>
                      {detail.value}
                      {propertyData.furnishingExtras &&
                        propertyData.furnishingExtras.length > 0 &&
                        detail.hasIcon && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className='w-6 h-6 cursor-pointer' />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
