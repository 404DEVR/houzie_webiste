'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import PropertyComponentSearchbar from '@/components/SearchBar/PropertyComponentSearchbar';
import RentComponent from '@/components/SearchBar/RentComponent';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/property');
  };

  return (
    <div className='relative backdrop-blur-md bg-white/10 rounded-2xl max-w-6xl mx-auto p-4 md:p-10'>
      <div className='flex flex-col flex-grow lg:flex-row gap-4 items-stretch p-2 bg-white shadow-lg rounded-2xl border border-gray-200'>
        <div className='w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 p-3 md:pr-4'>
          <label className='text-sm font-semibold block text-gray-800'>
            Office or Nearby
          </label>
          <input
            type='text'
            placeholder='Enter your office or nearby area'
            className='px-0 py-1 w-full border-none text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 placeholder:text-gray-800'
          />
        </div>

        <div className='w-full lg:w-1/4 border-b md:border-b-0 md:border-r p-3'>
          <PropertyComponentSearchbar />
        </div>

        <div className='w-full lg:w-1/4 border-b md:border-b-0 p-3'>
          <RentComponent />
        </div>

        <div className='w-full lg:w-auto p-3 my-auto'>
          <Button
            onClick={handleSearchClick}
            size='lg'
            className='w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-lg px-6 py-3 rounded-lg flex items-center justify-center gap-2'
          >
            <Search className='h-5 w-5' />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
