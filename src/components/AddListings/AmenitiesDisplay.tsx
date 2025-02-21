import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { AmenitiesDisplayinterface } from '@/interfaces/PropsInterface';

const furnishinglist = [
  {
    label: 'Water Purifier',
    value: 'waterPurifier',
    url: '/svg/water-dispenser.svg',
  },
  { label: 'Cupboard', value: 'cupboard', url: '/svg/cupboard.svg' },
  { label: 'Geyser', value: 'geyser', url: '/svg/geyser.svg' },
  { label: 'Fan', value: 'fan', url: '/svg/fan.svg' },
  { label: 'Microwave', value: 'microwave', url: '/svg/microvawe.svg' },
  {
    label: 'Single Bed',
    value: 'Single_bed',
    url: '/svg/single-bed.svg',
  },
  {
    label: 'Double Bed',
    value: 'Double_bed',
    url: '/svg/double bed.svg',
  },
  { label: 'Chair', value: 'Chair', url: '/svg/chair.svg' },
  { label: 'Bed', value: 'bed', url: '/svg/double bed.svg' },
  { label: 'Sofa', value: 'sofa', url: '/svg/sofa.svg' },
  {
    label: 'Dining table',
    value: 'diningTable',
    url: '/svg/dining.svg',
  },

  { label: 'AC', value: 'ac', url: '/svg/air-conditioning.svg' },
  { label: 'TV', value: 'tv', url: '/svg/tv.svg' },
  {
    label: 'Washing Machine',
    value: 'washing_machine',
    url: '/svg/washing-machine.svg',
  },
  { label: 'Fridge', value: 'fridge', url: '/svg/fridge.svg' },
  { label: 'Table', value: 'table', url: '/svg/table.svg' },
];

const amenitiesList = [
  { label: 'Wifi', value: 'WIFI', url: '/svg/wi-fi-icon.svg' },
  { label: 'Power Backup', value: 'POWER_BACKUP', url: '/svg/charge.svg' },
  {
    label: '4 Wheeler Parking',
    value: 'FOUR_WHEELER_PARKING',
    url: '/svg/parking.svg',
  },
  {
    label: '2 Wheeler Parking',
    value: 'TWO_WHEELER_PARKING',
    url: '/svg/parking (1).svg',
  },
  {
    label: '24/7 Water Supply',
    value: 'WATER_SUPPLY_24_7',
    url: '/svg/water supply.svg',
  },
  {
    label: '24/7 Security',
    value: 'SECURITY_24_7',
    url: '/svg/security.svg',
  },
  {
    label: 'Daily House Keeping',
    value: 'DAILY_HOUSEKEEPING',
    url: '/svg/house-keeping.svg',
  },
  {
    label: '24/7 CCTV Surveillance',
    value: 'CCTV',
    url: '/svg/cctv.svg',
  },
  { label: 'Meals', value: 'MEALS', url: '/svg/dinner.svg' },
];

const AmenitiesDisplay = ({ data, type }: AmenitiesDisplayinterface) => {
  const filteredAmenities = amenitiesList.filter((amenity) =>
    data.includes(amenity.value)
  );

  const filteredfurnishing = furnishinglist.filter((furnishing) =>
    data.includes(furnishing.value)
  );

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
      {type === 'amenities' &&
        filteredAmenities.map((amenity, index) => (
          <div key={index} className='mt-2'>
            <Button
              className={cn(
                'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors'
              )}
            >
              <Image
                src={amenity.url}
                alt={amenity.label}
                width={55}
                height={55}
                className='object-contain'
              />
              <div className='mt-2 text-center text-wrap'>{amenity.label}</div>
            </Button>
          </div>
        ))}
      {type === 'furnishing' &&
        filteredfurnishing.map((furnishing, index) => (
          <div key={index} className='mt-2'>
            <Button
              className={cn(
                'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors'
              )}
            >
              <Image
                src={furnishing.url}
                alt={furnishing.label}
                width={55}
                height={55}
                className='object-contain'
              />
              <div className='mt-2 text-center text-wrap'>
                {furnishing.label}
              </div>
            </Button>
          </div>
        ))}
    </div>
  );
};

export default AmenitiesDisplay;
