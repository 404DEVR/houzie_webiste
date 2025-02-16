import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

interface Item {
  label: string;
  value: string;
  url: string;
}

interface ItemGridProps {
  items: Item[];
  title: string;
  itemsPerRow?: number;
  maxRows?: number;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  title,
  itemsPerRow = 5,
  maxRows = 2,
}) => {
  const [showAll, setShowAll] = useState(false);

  // Calculate total slots available in initial view
  const totalSlots = itemsPerRow * maxRows;

  // Determine which items to show
  const visibleItems = showAll ? items : items.slice(0, totalSlots - 1);

  const remainingCount = items.length - (totalSlots - 1);

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
        {visibleItems.map((amenity, index) => (
          <div key={index} className=' mt-2'>
            <Button
              key={index}
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

        {!showAll && remainingCount > 0 && (
          <div
            onClick={() => setShowAll(true)}
            className='flex items-center justify-start cursor-pointer '
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
