'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MapLocationSelecter from '@/components/map/MapLocationSelecter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { updateAddPropertyLocation } from '@/redux/slices/formslices';
import { AppDispatch, RootState } from '@/redux/store';

const PropertyLocation = ({ handleNext, handleBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const propertyLocation = useSelector(
    (state: RootState) => state.addForm.propertyLocation
  );

  const formData = useSelector((state: RootState) => state.addForm);

  const [isValidAddress, setIsValidAddress] = useState(false); // state to track if the address is entered
  const [isLocationSelected, setIsLocationSelected] = useState(false);

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

  const handleLocationSave = (location) => {
    // dispatch(updateAddPropertyLocation(location)); // Update Redux store with the location
    setIsLocationSelected(true); // Set location selected to true
    console.log('locationnn', location);
  };

  const handleSubmit = () => {
    if (isLocationSelected) {
      handleNext();
    }
  };

  return (
    <Card className='w-full max-w-4xl my-6 mx-auto md:p-8'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Property Details</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='border rounded-md p-4'>
          <Label htmlFor='fullAddress' className='text-xl font-semibold mb-8'>
            Location
          </Label>
          <MapLocationSelecter onLocationSave={handleLocationSave} />
        </div>
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-4'>
        <Button
          onClick={handleBack}
          variant='outline'
          className='border-2 border-[#42A4AE] text-[#42A4AE]'
        >
          Back
        </Button>
        {!isLocationSelected ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='cursor-not-allowed'>
                <Button
                  onClick={handleSubmit}
                  className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
                  disabled={!isLocationSelected}
                >
                  Next, Add Address
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-[#42A4AE] text-white'>
                <p>Please Save a location to proceed.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            onClick={handleSubmit}
            className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
          >
            Next, Add Address
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyLocation;
