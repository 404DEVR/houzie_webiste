'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { updateAddPropertyLocation } from '@/redux/slices/formslices';
import { AppDispatch, RootState } from '@/redux/store';

interface PropertyLocationProps {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
}

const PropertyLocation = ({
  handleNext,
  handleBack,
}: PropertyLocationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const propertyLocation = useSelector(
    (state: RootState) => state.addForm.propertyLocation
  );

  const formData = useSelector((state: RootState) => state.addForm);

  const [isValidAddress, setIsValidAddress] = useState(false); // state to track if the address is entered

  useEffect(() => {
    // Simulate fetching location data based on full address
    const fetchLocationData = async () => {
      // Replace this with actual geocoding API call (e.g., Google Maps Geocoding API)
      // const response = await fetch(`https://api.example.com/geocode?address=${propertyLocation.fullAddress}`);
      // const data = await response.json();

      // Simulate the response for the given location, change this
      const simulatedData = {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        latitude: 19.076,
        longitude: 72.8777,
      };

      dispatch(updateAddPropertyLocation(simulatedData));
      setIsValidAddress(true);
    };

    if (propertyLocation.fullAddress) {
      // if address is non-empty
      fetchLocationData();
    } else {
      // if address is empty, set to initial state
      dispatch(
        updateAddPropertyLocation({
          city: '',
          state: '',
          country: '',
          latitude: null,
          longitude: null,
        })
      );
      setIsValidAddress(false);
    }
  }, [propertyLocation.fullAddress, dispatch]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateAddPropertyLocation({ fullAddress: e.target.value }));
    setIsValidAddress(false); // Disable submit when the address changes
  };

  const handleSubmit = () => {
    if (isValidAddress) {
      handleNext();
    }
  };

  return (
    <Card className='w-full max-w-4xl my-6 mx-auto md:p-8'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Property Details</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-6'>
        {/* Location Input */}
        <div>
          <Label htmlFor='fullAddress' className='text-sm font-bold'>
            Location <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='text'
            name='fullAddress'
            id='fullAddress'
            value={propertyLocation.fullAddress}
            onChange={handleAddressChange}
            placeholder='Full Address'
            className='block w-full px-4 sm:text-sm border-t-0 rounded-none border-x-0 border-b-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
          />
        </div>

        {/* Location Display and "Map" */}

        <div className='border rounded-md p-4'>
          <Label htmlFor='fullAddress' className='text-xl font-semibold mb-4'>
            Location
          </Label>
          <div className='bg-gray-100 p-4 text-sm font-medium'>
            {/* Display the location if available, or a default message */}
            <span className='flex items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2 inline-block'
              >
                <path d='M7 11a5 5 0 1 0 10 0a5 5 0 0 0-10 0Z' />
                <path d='M12 2a10 10 0 1 0 10 10V21a1 1 0 0 0-1 1H3a1 1 0 0 0-1-1V12A10 10 0 0 0 12 2Z' />
              </svg>
              {propertyLocation.city
                ? `${propertyLocation.city}, ${propertyLocation.state}`
                : 'Enter Full Address to see the Location'}
            </span>
          </div>

          {/* Placeholder for Map */}
          <div className='h-64 bg-sky-200 relative'>
            {/* Zoom Controls */}
            <div className='absolute top-2 right-2 bg-white border rounded-md shadow-md'>
              <Button
                size='icon'
                className='rounded-none border-b hover:bg-gray-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='12' y1='5' x2='12' y2='19' />
                  <line x1='5' y1='12' x2='19' y2='12' />
                </svg>
              </Button>
              <Button size='icon' className='rounded-none hover:bg-gray-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='5' y1='12' x2='19' y2='12' />
                </svg>
              </Button>
            </div>
            {/* User Icon */}
            <div className='absolute top-2 right-12 bg-white border rounded-md shadow-md'>
              <Button
                size='icon'
                className='rounded-none border-b hover:bg-gray-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='mr-2 inline-block'
                >
                  <path d='M19 13a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v6h14v-6a2 2 0 0 1 2-2 2 2 0 0 1 2 2v6h2.118a2 2 0 0 0 1.784-2.364l-1.342-6.71A1.963 1.963 0 0 0 19 13z'></path>
                </svg>
              </Button>
            </div>

            {/* Verified Listing */}
            <div className='absolute bottom-2 right-2 text-xs text-gray-600'>
              <span className='flex items-center'>
                Verified listing
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='green'
                  stroke='white'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='ml-1 rounded-full bg-green-500'
                >
                  <polyline points='20 6 9 17 4 12' />
                </svg>
              </span>
            </div>
          </div>
          {/* Google Verified Text */}
          <div className='p-4 text-sm text-gray-600 border-t'>
            We verified that this listing's location is accurate.
            <a href='#' className='ml-1 text-blue-500 hover:underline'>
              Learn more
            </a>
          </div>
        </div>
        {/* <MapLocationSelecter/> */}
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-4'>
        <Button
          onClick={handleBack}
          variant='outline'
          className='border-2 border-[#42A4AE] text-[#42A4AE]'
        >
          Back
        </Button>
        {!isValidAddress ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='cursor-not-allowed'>
                <Button
                  onClick={handleSubmit}
                  className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
                  disabled={!isValidAddress}
                >
                  Next, Add Address
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-[#42A4AE] text-white'>
                <p>Please fill out all required fields to proceed.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            onClick={handleSubmit}
            className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
            disabled={!isValidAddress}
          >
            Next, Add Address
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyLocation;
