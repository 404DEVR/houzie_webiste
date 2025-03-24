'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFilters } from '@/lib/context/FilterContext';

import PlaceAutocomplete from '@/components/map/MapAutoComplete';
import PropertyComponentSearchbar from '@/components/SearchBar/PropertyComponentSearchbar';
import RentComponent from '@/components/SearchBar/RentComponent';
import { Button } from '@/components/ui/button';

import { setLocation } from '@/redux/slices/searchSlice';
import { RootState } from '@/redux/store';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API ?? 'YOUR_API_KEY';

const SearchBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchData = useSelector((state: RootState) => state.search);
  const { updateFilters } = useFilters();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const handleSearchClick = () => {
    router.push('/property');
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLocation(e.target.value));
    updateFilters('location', e.target.value);
  };

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
    >
      <div className='relative rounded-2xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col w-full flex-grow xl:flex-row gap-2 items-stretch py-4 px-4 justify-between bg-white shadow-lg rounded-2xl  border border-gray-200'>
          <div className='w-full xl:w-[45%]'>
            <label className='text-xl font-medium block text-gray-800 leading-normal'>
              Location
            </label>
            <div className='autocomplete-control'>
              <PlaceAutocomplete
                onPlaceSelect={setSelectedPlace}
                location={searchData.location}
                handleLocationChange={handleLocationChange}
              />
            </div>
            {/* <div className='relative flex justify-center items-center bg-[#e0e0e0] px-4 py-2 rounded-md w-full border-none'>
            <MdLocationOn className='h-6 w-6' />
            <input
              type='text'
              placeholder='Enter your office or nearby address'
              className='bg-[#e0e0e0] bg-transparent px-2 w-full border-none text-sm sm:text-md focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 placeholder:text-gray-800'
              value={searchData.location}
              onChange={handleLocationChange}
            />
          </div> */}
          </div>
          <div className='w-full xl:w-[55%] flex flex-col xl:flex-row justify-between items-center gap-2'>
            <div className='w-full xl:w-[40%] '>
              <PropertyComponentSearchbar />
            </div>
            <div className='w-full xl:w-[40%]'>
              <RentComponent />
            </div>
            <div className='w-full xl:w-[20%] relative h-full'>
              <Button
                onClick={handleSearchClick}
                size='custom'
                className='w-full p-4 bg-[#3b8ff6] xl:absolute xl:bottom-0 text-white flex items-end justify-center '
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default SearchBar;
