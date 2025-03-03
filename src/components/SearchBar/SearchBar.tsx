'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PropertyComponentSearchbar from '@/components/SearchBar/PropertyComponentSearchbar';
import RentComponent from '@/components/SearchBar/RentComponent';
import { Button } from '@/components/ui/button';

import { setLocation } from '@/redux/slices/searchSlice';
import { RootState } from '@/redux/store';

const SearchBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchData = useSelector((state: RootState) => state.search);

  const handleSearchClick = () => {
    router.push('/property');
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLocation(e.target.value));
  };

  return (
    <div className='relative rounded-2xl xl:rounded-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col w-full flex-grow xl:flex-row gap-4 items-stretch py-4 px-4 sm:px-6 lg:px-8 justify-between bg-white shadow-lg rounded-3xl xl:rounded-full border border-gray-200'>
        <div className='w-full xl:w-2/4 border-b lg:border-b-0 lg:border-r border-gray-300 pt-4 lg:pt-6 pl-3 lg:pl-10'>
          <label className='text-xl sm:text-2xl font-medium block text-gray-800 leading-none'>
            Office Or Nearby Address
          </label>
          <input
            type='text'
            placeholder='Enter your office or nearby address'
            className='px-0 py-1 w-full border-none text-sm sm:text-md focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 placeholder:text-gray-800'
            value={searchData.location}
            onChange={handleLocationChange}
          />
        </div>

        <div className='w-full xl:w-2/5 border-b lg:border-b-0 lg:border-r pt-4 lg:pt-6 pl-3 lg:pl-10'>
          <PropertyComponentSearchbar />
        </div>

        <div className='w-full xl:w-1/4 border-b lg:border-b-0 pt-4 lg:pt-6 pl-3 lg:pl-10'>
          <RentComponent />
        </div>

        <div className='w-full xl:w-auto my-4 lg:my-auto'>
          <Button
            onClick={handleSearchClick}
            size='lg'
            className='w-full text-[#6666ff] flex items-center justify-center relative h-12 sm:h-16'
          >
            <Image
              src='/svg/search button.svg'
              alt='Search button'
              width={80}
              height={80}
              className='object-contain absolute'
              quality={100}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
