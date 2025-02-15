import { Heart, Share } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

const actionButtons = [
  {
    icon: Share,
    label: 'Share',
  },
  {
    icon: Heart,
    label: 'Favorite',
  },
];

export default function HeaderContainer() {
  return (
    <header className='flex flex-col sm:flex-row items-start justify-between w-full gap-4 sm:gap-6 py-4 sm:py-6'>
      <div className='flex-1 w-full sm:w-auto'>
        <h1 className='font-medium text-2xl sm:text-[32px] leading-tight sm:leading-[48px] text-black font-inter'>
          Seaside Serenity Villa
        </h1>
      </div>

      <div className='flex items-center gap-3 w-full sm:w-auto'>
        {actionButtons.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant='default'
            className='flex-1 sm:flex-initial items-center gap-2 bg-[#42A4AE] hover:bg-[#3a939c] text-white min-w-[100px] sm:min-w-fit py-2 px-4'
          >
            <Icon className='h-4 w-4' />
            <span className='text-sm font-normal hidden sm:inline'>
              {label}
            </span>
          </Button>
        ))}
      </div>
    </header>
  );
}
