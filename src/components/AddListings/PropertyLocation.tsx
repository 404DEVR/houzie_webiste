'use client';

import { useEffect, useRef } from 'react';
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

import {
  populateEditForm,
  updateAddPropertyLocation,
  updateEditPropertyLocation,
} from '@/redux/slices/formslices';
import { AppDispatch, RootState } from '@/redux/store';
import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

interface PropertyLocationProps {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
}

interface Location {
  lat: number | null;
  lng: number | null;
}

interface PropertyLocationState {
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

const PropertyLocation = ({
  handleNext,
  handleBack,
  page,
}: PropertyLocationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { auth } = useAuth();
  const addPropertyLocation = useSelector(
    (state: RootState) => state.addForm.propertyLocation
  );
  const editPropertyLocation = useSelector(
    (state: RootState) => state.editForm.propertyLocation
  );

  const propertyLocation: PropertyLocationState =
    page === 'edit' ? editPropertyLocation : addPropertyLocation;

  const propertyDetails = useSelector(
    (state: RootState) => state.editForm.propertyDetails
  );
  const photos = useSelector((state: RootState) => state.editForm.photos);
  const verification = useSelector(
    (state: RootState) => state.editForm.verification
  );
  const restructuredData = useSelector(
    (state: RootState) => state.editForm.restructuredData
  );
  const isEditing = useSelector((state: RootState) => state.editForm.isEditing);
  const editingListingId = useSelector(
    (state: RootState) => state.editForm.editingListingId
  );
  const currentPage = useSelector(
    (state: RootState) => state.editForm.currentPage
  );

  const initialPropertyLocation = useRef<PropertyLocationState | null>(null);

  const isInitialValueSet = useRef(false); // Track if initial value is set

  useEffect(() => {
    if (page === 'edit' && !isInitialValueSet.current) {
      dispatch(
        populateEditForm({
          currentPage: currentPage,
          propertyDetails: propertyDetails,
          propertyLocation: propertyLocation,
          photos: photos,
          verification: verification,
          restructuredData: restructuredData,
          isEditing: isEditing,
          editingListingId: editingListingId,
        })
      );

      // Initialize initialPropertyLocation.current ONLY ONCE
      initialPropertyLocation.current = { ...propertyLocation };
      isInitialValueSet.current = true; // Mark as initialized
    }
  }, [
    page,
    currentPage,
    propertyDetails,
    propertyLocation,
    photos,
    verification,
    restructuredData,
    isEditing,
    editingListingId,
    dispatch,
  ]);

  const formData = useSelector((state: RootState) => state.addForm);

  const [isValidAddress, setIsValidAddress] = useState(false); // state to track if the address is entered
  const [isLocationSelected, setIsLocationSelected] = useState(false);

  // useEffect(() => {
  //   // Simulate fetching location data based on full address
  //   const fetchLocationData = async () => {
  //     // Replace this with actual geocoding API call (e.g., Google Maps Geocoding API)
  //     // const response = await fetch(`https://api.example.com/geocode?address=${propertyLocation.fullAddress}`);
  //     // const data = await response.json();

  //     // Simulate the response for the given location, change this
  //     const simulatedData = {
  //       city: 'Mumbai',
  //       state: 'Maharashtra',
  //       country: 'India',
  //       latitude: 19.076,
  //       longitude: 72.8777,
  //     };

  //     dispatch(updateAddPropertyLocation(simulatedData));
  //     setIsValidAddress(true);
  //   };

  //   if (propertyLocation.fullAddress) {
  //     // if address is non-empty
  //     fetchLocationData();
  //   } else {
  //     // if address is empty, set to initial state
  //     dispatch(
  //       updateAddPropertyLocation({
  //         city: '',
  //         state: '',
  //         country: '',
  //         latitude: null,
  //         longitude: null,
  //       })
  //     );
  //     setIsValidAddress(false);
  //   }
  // }, [propertyLocation.fullAddress, dispatch]);

  const handleLocationSave = (location: Location) => {
    page === 'edit'
      ? dispatch(
          updateEditPropertyLocation({
            ...propertyLocation,
            latitude: location.lat,
            longitude: location.lng,
          })
        )
      : dispatch(
          updateAddPropertyLocation({
            ...propertyLocation,
            latitude: location.lat,
            longitude: location.lng,
          })
        );
    setIsLocationSelected(true);
  };

  const handleSubmit = () => {
    if (isLocationSelected) {
      handleNext();
    }
  };

  const handleEdit = async () => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }
      interface ChangedFields {
        location?: {
          city: string;
          state: string;
          country: string;
          latitude: number | null;
          longitude: number | null;
        };
      }

      const changedFields: ChangedFields = {};

      if (initialPropertyLocation.current) {
        const initialLocation = initialPropertyLocation.current;

        const locationChanged =
          initialLocation.latitude !== propertyLocation.latitude ||
          initialLocation.longitude !== propertyLocation.longitude;

        if (locationChanged) {
          changedFields.location = {
            city: propertyLocation.city,
            state: propertyLocation.state,
            country: propertyLocation.country,
            latitude: propertyLocation.latitude,
            longitude: propertyLocation.longitude,
          };
        }

        // console.log(changedFields);

        if (Object.keys(changedFields).length > 0) {
          // const response = await axios.patch(
          //   `https://api.houzie.in/listings/${editingListingId}`,
          //   changedFields,
          //   {
          //     headers: {
          //       Authorization: `Bearer ${accessToken}`,
          //     },
          //   }
          // );
          // if (response.status === 200) {
          //   console.log('Location updated successfully!');
          //   toast({
          //     title: 'Success',
          //     description: 'Property location updated successfully.',
          //   });
          //   handleNext();
          // } else {
          //   console.error('Failed to update location:', response.status);
          //   toast({
          //     title: 'Update Failed',
          //     description: 'Failed to update property location.',
          //   });
          // }
        } else {
          toast({
            title: 'No changes',
            description: 'No changes were made to the property location.',
          });
          // handleNext();
        }
      } else {
        console.error('Initial property location is not available');
      }
    } catch (error) {
      toast({
        title: 'Edit Failed',
        description: 'Failed to edit property location.',
      });
    }
  };

  const getInitialLocation = () => {
    if (propertyLocation) {
      const { latitude, longitude } = propertyLocation;

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        return { lat: latitude, lng: longitude };
      }
    }
    return null;
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
          <MapLocationSelecter
            onLocationSave={handleLocationSave}
            initialLocation={getInitialLocation()}
          />
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
                {page === 'edit' ? (
                  <Button
                    onClick={handleEdit}
                    className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
                    disabled={!isLocationSelected}
                  >
                    Edit And Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
                    disabled={!isLocationSelected}
                  >
                    Next, Add Address
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent className='bg-[#42A4AE] text-white'>
                {page === 'edit' ? (
                  <p>Please Update a location to proceed.</p>
                ) : (
                  <p>Please Save a location to proceed.</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : page === 'edit' ? (
          <Button
            onClick={handleEdit}
            className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
          >
            Edit And Next
          </Button>
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
