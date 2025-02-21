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
    url: '/svg/water-dispenser.svg',
  },
  { label: 'Cupboard', value: 'CUPBOARD', url: '/svg/cupboard.svg' },
  { label: 'Geyser', value: 'GEYSER', url: '/svg/geyser.svg' },
  { label: 'Fan', value: 'FAN', url: '/svg/fan.svg' },
  { label: 'Microwave', value: 'MICROWAVE', url: '/svg/microvawe.svg' },
  {
    label: 'Single Bed',
    value: 'SINGLE_BED',
    url: '/svg/single-bed.svg',
  },
  {
    label: 'Double Bed',
    value: 'DOUBLE_BED',
    url: '/svg/double bed.svg',
  },
  { label: 'Chair', value: 'CHAIR', url: '/svg/chair.svg' },
  { label: 'Bed', value: 'BED', url: '/svg/double bed.svg' },
  { label: 'Sofa', value: 'SOFA', url: '/svg/sofa.svg' },
  {
    label: 'Dining table',
    value: 'DINING_TABLE',
    url: '/svg/dining.svg',
  },
  { label: 'AC', value: 'AC', url: '/svg/air-conditioning.svg' },
  { label: 'TV', value: 'TV', url: '/svg/tv.svg' },
  {
    label: 'Washing Machine',
    value: 'WASHING_MACHINE',
    url: '/svg/washing-machine.svg',
  },
  { label: 'Fridge', value: 'FRIDGE', url: '/svg/fridge.svg' },
  { label: 'Table', value: 'TABLE', url: '/svg/table.svg' },
];

const amenitiesList: Item[] = [
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
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 ${
          showAll ? 'overflow-y-auto max-h-[60vh] sm:max-h-[500px]' : ''
        }`}
      >
        {visibleItems.map((item, index) => (
          <div key={index} className='mt-2'>
            <Button
              className={cn(
                'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors'
              )}
            >
              <Image
                src={item.url}
                alt={item.label}
                width={55}
                height={55}
                className='object-contain'
              />
              <div className='mt-2 text-center text-wrap'>{item.label}</div>
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
