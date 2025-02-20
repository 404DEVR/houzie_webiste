import { InfoIcon } from 'lucide-react';
import React from 'react';

import ItemGrid from '@/components/cards/IconGrid';
import { Property } from '@/components/detailspage/HeaderContainer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Overviewprops {
  propertyData: Property;
}

const transformString = (str: string | null | undefined) => {
  if (!str) return '';
  // Replace underscores with spaces and convert to title case
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PropertyDetails = ({ propertyData }: Overviewprops) => {
  const propertyDetails = [
    [
      { label: 'Bedroom', value: propertyData.bedrooms },
      { label: 'Balcony', value: propertyData.balconies },
      {
        label: 'Gated Community',
        value: propertyData.features.includes('GATED_COMMUNITY') ? 'Yes' : 'No',
      },
    ],
    [
      { label: 'Bathroom', value: propertyData.bathrooms },
      {
        label: '4 Wheeler Parking',
        value: propertyData.amenities.includes('FOUR_WHEELER_PARKING')
          ? 'Yes'
          : 'No',
      },
      {
        label: '2 Wheeler Parking',
        value: propertyData.amenities.includes('TWO_WHEELER_PARKING')
          ? 'Yes'
          : 'No',
      },
    ],
    [
      {
        label: 'Furnishing',
        value: transformString(propertyData.furnishing),
        hasIcon: true,
      },
      {
        label: 'Pet Friendly',
        value: propertyData.features.includes('PET_FRIENDLY') ? 'Yes' : 'No',
      },
      {
        label: 'Available for',
        value: transformString(propertyData.preferredTenant),
      },
    ],
  ];

  return (
    <Card className='h-[307px] border-zinc-200 mt-7'>
      <CardContent className='flex flex-col gap-5 p-5'>
        <h2 className='font-semibold text-2xl leading-9'>Property Overview</h2>

        <div className='flex items-start justify-between flex-1 w-full'>
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
                    {propertyData.furnishingExtras && detail.hasIcon && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className='w-6 h-6 cursor-pointer' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
                              <ItemGrid
                                title='Furnishings'
                                data={propertyData.furnishingExtras.map(
                                  transformString
                                )}
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
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
