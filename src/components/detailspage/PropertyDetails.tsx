import { InfoIcon } from 'lucide-react';
import React from 'react';

import ItemGrid from '@/components/cards/IconGrid';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const propertyDetails = [
  [
    { label: 'Bedroom', value: '3' },
    { label: 'Balcony', value: '2' },
    { label: 'Gated Community', value: 'No' },
  ],
  [
    { label: 'Bathroom', value: '2' },
    { label: 'Parking', value: 'Yes' },
    { label: 'Floor Number', value: '12' },
  ],
  [
    { label: 'Furnishing', value: 'Fully Furnished', hasIcon: true },
    { label: 'Pet Friendly', value: 'Yes' },
    { label: 'Available for', value: 'Family / Bachelor / Company' },
  ],
];

const furnishings = [
  {
    label: 'Water Purifier',
    value: 'waterPurifier',
    url: '/svg/water-dispenser.svg',
  },
  { label: 'Cupboard', value: 'cupboard', url: '/svg/cupboard.svg' },
  { label: 'Geyser', value: 'geyser', url: '/svg/geyser.svg' },
  { label: 'Fan', value: 'fan', url: '/svg/fan.svg' },
  { label: 'Microwave', value: 'microwave', url: '/svg/microvawe.svg' },
  { label: 'Bed', value: 'bed', url: '/svg/double bed.svg' },
  { label: 'Sofa', value: 'sofa', url: '/svg/sofa.svg' },
  {
    label: 'Dining table',
    value: 'diningTable',
    url: '/svg/dining.svg',
  },

  { label: 'AC', value: 'ac', url: '/svg/air-conditioning.svg' },
  { label: 'TV', value: 'tv', url: '/svg/tv.svg' },
  { label: 'Washing Machine', value: 'washing_machine', url: '/svg/washing-machine.svg' },
  { label: 'Fridge', value: 'fridge', url: '/svg/fridge.svg' },
  { label: 'Table', value: 'table', url: '/svg/table.svg' },
];

const Overview = () => {
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
                    {detail.hasIcon && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className='w-6 h-6 cursor-pointer' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <ItemGrid items={furnishings} title='Furnishings' />
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

export default Overview;
