import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { AmenitiesDisplayinterface } from '@/interfaces/PropsInterface';

const furnishinglist = [
  {
    label: 'Water Purifier',
    value: 'WATER_PURIFIER',
    url: '/svg/material-symbols_water-loss.svg',
  },
  {
    label: 'Cupboard',
    value: 'CUPBOARD',
    url: '/svg/mdi_wardrobe.svg',
  },
  {
    label: 'Geyser',
    value: 'GEYSER',
    url: '/svg/mdi_electric-water-heater.svg',
  },
  {
    label: 'Fan',
    value: 'FAN',
    url: '/svg/fan.svg',
  },
  {
    label: 'Microwave',
    value: 'MICROWAVE',
    url: '/svg/material-symbols_microwave.svg',
  },
  {
    label: 'Single Bed',
    value: 'SINGLE_BED',
    url: '/svg/material-symbols_bed-rounded.svg',
  },
  {
    label: 'Double Bed',
    value: 'DOUBLE_BED',
    url: '/svg/material-symbols_bed-rounded.svg',
  },
  {
    label: 'Chair',
    value: 'CHAIR',
    url: '/svg/chair.svg',
  },
  {
    label: 'Bed',
    value: 'BED',
    url: '/svg/material-symbols_bed-rounded.svg',
  },
  {
    label: 'Sofa',
    value: 'SOFA',
    url: '/svg/solar_sofa-bold.svg',
  },
  {
    label: 'Dining table',
    value: 'DINING_TABLE',
    url: '/svg/game-icons_round-table.svg',
  },
  {
    label: 'AC',
    value: 'AC',
    url: '/svg/mynaui_air-conditioner-solid.svg',
  },
  {
    label: 'TV',
    value: 'TV',
    url: '/svg/mynaui_tv-solid.svg',
  },
  {
    label: 'Washing Machine',
    value: 'WASHING_MACHINE',
    url: '/svg/icon-park-solid_washing-machine.svg',
  },
  {
    label: 'Fridge',
    value: 'FRIDGE',
    url: '/svg/mdi_fridge-outline.svg',
  },
  {
    label: 'Table',
    value: 'TABLE',
    url: '/svg/material-symbols_table-bar-rounded.svg',
  },
];

const amenitiesList = [
  { label: 'Wifi', value: 'WIFI', url: '/svg/material-symbols_wifi.svg' },
  {
    label: 'Power Backup',
    value: 'POWER_BACKUP',
    url: '/svg/ic_round-power.svg',
  },
  {
    label: '4 Wheeler Parking',
    value: 'FOUR_WHEELER_PARKING',
    url: '/svg/fluent_vehicle-car-parking-16-regular.svg',
  },
  {
    label: '2 Wheeler Parking',
    value: 'TWO_WHEELER_PARKING',
    url: '/svg/material-symbols_directions-bike.svg',
  },
  {
    label: '24/7 Water Supply',
    value: 'WATER_SUPPLY_24_7',
    url: '/svg/famicons_water-sharp.svg',
  },
  {
    label: '24/7 Security',
    value: 'SECURITY_24_7',
    url: '/svg/healthicons_security-worker.svg',
  },
  {
    label: 'Daily House Keeping',
    value: 'DAILY_HOUSEKEEPING',
    url: '/svg/material-symbols-light_cleaning-bucket-rounded.svg',
  },
  {
    label: '24/7 CCTV Surveillance',
    value: 'CCTV',
    url: '/svg/ph_security-camera-fill.svg',
  },
  { label: 'Meals', value: 'MEALS', url: '/svg/fluent_food-24-filled.svg' },
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
