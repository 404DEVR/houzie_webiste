import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { Item } from '@/interfaces/Interface';
import { ItemGridProps } from '@/interfaces/PropsInterface';

const furnishingList: Item[] = [
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
  {
    label: 'Cupboard',
    value: 'WARDROBE',
    url: '/svg/mdi_wardrobe.svg',
  },
  {
    label: 'Study Table',
    value: 'STUDY_TABLE',
    url: '/svg/material-symbols_table-bar-rounded.svg',
  },
  {
    label: 'Exhaust',
    value: 'EXHAUST',
    url: '/svg/exhaust.svg',
  },
  {
    label: 'Mattress',
    value: 'MATTRESS',
    url: '/svg/mattress.svg',
  },
];

const amenitiesList: Item[] = [
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

const ItemGrid: React.FC<ItemGridProps> = ({
  data,
  title,
  type,
  itemsPerRow = 5,
  maxRows = 2,
}) => {
  const [showAll, setShowAll] = useState(false);

  const itemsList = type === 'amenities' ? amenitiesList : furnishingList;
  const filteredItems = itemsList.filter((item) => data.includes(item.value));

  const totalSlots = itemsPerRow * maxRows;
  const visibleItems = showAll
    ? filteredItems
    : filteredItems.slice(0, totalSlots - 1);
  const remainingCount = filteredItems.length - (totalSlots - 1);

  return (
    <div
      className={`p-4 sm:p-6 bg-white rounded-lg shadow-sm ${
        showAll ? 'h-auto' : 'h-auto'
      } transition-all duration-300 ease-in-out`}
    >
      <h3 className='font-semibold text-xl sm:text-2xl leading-9 mb-2 sm:mb-4'>
        {title}
      </h3>

      <div
        className={`flex flex-wrap gap-2 md:gap-6 ${
          showAll ? 'overflow-y-auto max-h-[60vh] sm:max-h-[500px]' : ''
        }`}
      >
        {visibleItems.map((item, index) => (
          <div key={index} className=''>
            <Button
              className={cn(
                'rounded-xl border-2 w-28 h-28 flex flex-col items-center justify-center text-sm font-medium transition-colors'
              )}
            >
              <Image
                src={item.url}
                alt={item.label}
                width={40}
                height={40}
                className='object-contain'
              />
              <div className='mt-0.5 text-center text-wrap'>{item.label}</div>
            </Button>
          </div>
        ))}

        {!showAll && remainingCount > 0 && (
          <div
            onClick={() => setShowAll(true)}
            className='flex items-center justify-start cursor-pointer'
          >
            <div className='border-2 border-black px-2 py-2 sm:px-4 sm:py-4 rounded-lg text-xs sm:text-sm bg-pink-50'>
              {`+${remainingCount} more`}
            </div>
          </div>
        )}
      </div>

      {showAll && (
        <div className='mt-4 text-center'>
          <button
            onClick={() => setShowAll(false)}
            className='px-3 py-1 sm:px-4 sm:py-2 bg-pink-50 border-2 border-black rounded-lg text-xs sm:text-sm'
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemGrid;
