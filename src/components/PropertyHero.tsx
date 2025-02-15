'use client';

import Image from 'next/image';

import SearchBar from '@/components/SearchBar/SearchBar';

export default function PropertyHero() {
  return (
    <div className='relative min-h-[550px] flex items-center justify-center'>
      <div className='absolute inset-0 -z-10'>
        <Image
          src='/svg/Heroimage.svg'
          alt='Modern living room'
          fill
          priority
          className='object-cover brightness-[0.85]'
          quality={100}
        />
      </div>

      <div className='container mx-auto px-4 my-10'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
            Find your <span className='text-[#5CC1B1]'>Perfect</span> Property
          </h1>
          <p className='text-white/90 max-w-2xl mx-auto text-sm md:text-base'>
            We can help you find{' '}
            <span className='text-[#5CC1B1]'>your dream home</span> by guiding
            you through a few simple steps and matching you with tailor-made
            property listings.
          </p>
        </div>

        <SearchBar />
      </div>
    </div>
  );
}
