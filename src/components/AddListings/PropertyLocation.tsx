'use client';

import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useAuth from '@/hooks/useAuth';

import CurrentOccupantsProfile from '@/components/AddListings/CurrentOccupantsProfile';
import FileUploader from '@/components/AddListings/FileUploader';
import MapLocationSelecter from '@/components/map/MapLocationSelecter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Location, PropertyLocationState } from '@/interfaces/Interface';
import { PropertyLocationProps } from '@/interfaces/PropsInterface';
import {
  populateEditForm,
  restructureAddFormData,
  updateAddPropertyLocation,
  updateEditPropertyLocation,
} from '@/redux/slices/formslices';
import { AppDispatch, RootState } from '@/redux/store';

const PropertyLocation = ({
  handleNext,
  handleBack,
  page,
  setIsDialogOpen,
}: PropertyLocationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { auth } = useAuth();
  const editform = useSelector(
    (state: RootState) => state.addForm.propertyDetails
  );
  const addPropertyLocation = useSelector(
    (state: RootState) => state.addForm.propertyLocation
  );
  const editPropertyLocation = useSelector(
    (state: RootState) => state.editForm.propertyLocation
  );

  const addPropertyDetails = useSelector(
    (state: RootState) => state.addForm.propertyDetails
  );
  const editPropertyDetails = useSelector(
    (state: RootState) => state.editForm.propertyDetails
  );

  const propertyLocation: PropertyLocationState =
    page === 'edit' ? editPropertyLocation : addPropertyLocation;

  const propertyDetails =
    page === 'edit' ? editPropertyDetails : addPropertyDetails;

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

  const isInitialValueSet = useRef(false);

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

      initialPropertyLocation.current = { ...propertyLocation };
      isInitialValueSet.current = true;
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

  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [hasImages, setHasImages] = useState(false);
  const [isOccupantDataValid, setIsOccupantDataValid] = useState(true);

  const handleImageUploadStatusChange = (hasImages: boolean) => {
    setHasImages(hasImages);
  };

  const handleLocationUploadStatusChange = (isLocationSelected: boolean) => {
    setIsLocationSelected(isLocationSelected);
  };

  const handleOccupantDataChange = (isValid: boolean) => {
    setIsOccupantDataValid(isValid);
  };

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
      dispatch(restructureAddFormData());
      handleNext();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackButton = () => {
    handleBack();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const isNextButtonDisabled = !(
    isLocationSelected &&
    hasImages &&
    isOccupantDataValid
  );

  const getTooltipMessage = () => {
    if (!isLocationSelected) {
      return 'Please save a location to proceed.';
    } else if (!hasImages) {
      return 'Please add at least one image to proceed.';
    } else if (!isOccupantDataValid) {
      return 'Please complete the Current Occupants Profile to proceed.';
    } else {
      return '';
    }
  };

  useEffect(() => {
    handleLocationUploadStatusChange &&
      handleLocationUploadStatusChange(
        propertyLocation.longitude !== null &&
          propertyLocation.latitude !== null
      );
  }, [
    handleLocationUploadStatusChange,
    propertyLocation.longitude,
    propertyLocation.latitude,
  ]);

  return (
    <Card className='w-full max-w-4xl my-6 md:my-0 mx-auto md:p-8'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Property Details</CardTitle>
      </CardHeader>
      <CardContent className='grid'>
        <div className='border rounded-xl p-8 mb-3'>
          <MapLocationSelecter
            onLocationSave={handleLocationSave}
            initialLocation={getInitialLocation()}
            handleLocationUploadStatusChange={handleLocationUploadStatusChange}
          />
        </div>
        {propertyDetails.isPreoccupied &&
          propertyDetails.preoccupiedPropertyType !== 'CO_LIVING' && (
            <CurrentOccupantsProfile
              onOccupantDataChange={handleOccupantDataChange}
              page={page}
            />
          )}

        <FileUploader
          handleNext={handleNext}
          handleBack={handleBack}
          page={page}
          setIsDialogOpen={setIsDialogOpen}
          onImageUploadStatusChange={handleImageUploadStatusChange}
        />
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-4'>
        <Button
          onClick={handleBackButton}
          variant='outline'
          className='bg-[#f5f5fa] text-[#f66659] hover:bg-[#f66659] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
        >
          Back
        </Button>
        {!isLocationSelected || !hasImages || !isOccupantDataValid ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='cursor-not-allowed'>
                <Button
                  onClick={handleSubmit}
                  className='bg-[#f5f5fa] text-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
                  disabled={isNextButtonDisabled}
                >
                  save and review
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-blue-500 text-white border-none shadow-lg shadow-slate-600'>
                <p>{getTooltipMessage()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            onClick={handleSubmit}
            className='bg-[#f5f5fa] text-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
            disabled={isNextButtonDisabled}
          >
            save and review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyLocation;
