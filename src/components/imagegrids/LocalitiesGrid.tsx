'use client';

import { ScalableImageCard } from '@/components/cards/ScalableImageCard';

import { CityCard } from '@/interfaces/Interface';

const cities: CityCard[] = [
  { name: 'Bahía Blanca', imageUrl: '/images/skyscrapers-sunset.png' },
  {
    name: 'La Plata',
    imageUrl:
      '/images/vertical-cityscape-with-tall-skyscrapers-new-york-usa.png',
  },
  {
    name: 'San Isidro',
    imageUrl:
      '/images/amazing-shot-us-flag-park-manhattan-skyline-background 1.png',
  },
  { name: 'Resistencia', imageUrl: '/images/new-york-cityscape 1.png' },
  {
    name: 'San Juan',
    imageUrl: '/images/chicago-urban-aerial-view-dusk 1.png',
  },
  {
    name: 'Baton Rouge (LA)',
    imageUrl: '/images/new-york-skycraper-sunset-usa.png',
  },
  {
    name: 'Lomas de Zamora',
    imageUrl:
      '/images/beautiful-view-empire-states-skyscrapers-new-york-city.png',
  },
];

export default function CityGrid({ normal }) {
  return (
    <div className='mx-auto'>
      {normal && (
        <h2 className='font-semibold text-2xl leading-9'>Other Localities</h2>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 h-auto lg:h-[800px]'>
        <div className='lg:col-span-3 flex flex-col gap-4'>
          <ScalableImageCard
            {...cities[0]}
            className='h-64 md:h-80 lg:h-[28%] rounded-2xl'
          />
          <ScalableImageCard
            {...cities[1]}
            className='h-64 md:h-80 lg:h-[68%] rounded-2xl'
          />
        </div>

        <div className='lg:col-span-6 flex flex-col gap-4'>
          <ScalableImageCard
            {...cities[2]}
            className='h-64 md:h-80 lg:h-[48%] rounded-2xl'
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto lg:h-[48%]'>
            <ScalableImageCard
              {...cities[3]}
              className='h-64 md:h-80 lg:h-full rounded-2xl'
            />
            <ScalableImageCard
              {...cities[4]}
              className='h-64 md:h-80 lg:h-full rounded-2xl'
            />
          </div>
        </div>

        <div className='lg:col-span-3 flex flex-col gap-4'>
          <ScalableImageCard
            {...cities[5]}
            className='h-64 md:h-80 lg:h-[68%] rounded-2xl'
          />
          <ScalableImageCard
            {...cities[6]}
            className='h-64 md:h-80 lg:h-[28%] rounded-2xl'
          />
        </div>
      </div>
    </div>
  );
}
