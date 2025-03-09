'use client';

import axios from 'axios';
import { isEqual } from 'lodash';
import { Calendar as CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib/utils';
import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import CustomInput from '@/components/inputs/CustomInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { PropertyDetailsForminteface } from '@/interfaces/PropsInterface';
import {
  populateEditForm,
  updateAddPropertyDetails,
  updateEditPropertyDetails,
} from '@/redux/slices/formslices';
import { AppDispatch, RootState } from '@/redux/store';

const PropertyDetailsForm = ({
  handleNext,
  page,
}: PropertyDetailsForminteface) => {
  const toast = useCustomToast();
  const [fieldErrors, setFieldErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [floorError, setFloorError] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState({
    maidCharges: 0,
    cookCharges: 0,
    wifiCharges: 0,
    otherCharges: 0,
  });
  const { auth } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const addPropertyDetails = useSelector(
    (state: RootState) => state.addForm.propertyDetails
  );

  const editPropertyDetails = useSelector(
    (state: RootState) => state.editForm.propertyDetails
  );

  const propertyDetails =
    page === 'edit' ? editPropertyDetails : addPropertyDetails;

  const propertyLocation = useSelector(
    (state: RootState) => state.editForm.propertyLocation
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

  const initialPropertyDetails = useRef(null);

  useEffect(() => {
    if (page === 'edit') {
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
      initialPropertyDetails.current = JSON.parse(
        JSON.stringify(propertyDetails)
      );
    }
  }, [page]);

  useEffect(() => {
    const totalMaintenanceCharges =
      additionalCharges.maidCharges +
      additionalCharges.cookCharges +
      additionalCharges.wifiCharges +
      additionalCharges.otherCharges;

    if (page === 'edit') {
      dispatch(
        updateEditPropertyDetails({
          maintenanceCharges: String(totalMaintenanceCharges),
        })
      );
    } else {
      dispatch(
        updateAddPropertyDetails({
          maintenanceCharges: String(totalMaintenanceCharges),
        })
      );
    }
  }, [additionalCharges]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked } = e.target;
  //   let formattedValue = value;

  //   if (type === 'number') {
  //     formattedValue = Number(value) < 0 ? '0' : value;
  //   }

  //   formattedValue =
  //     name === 'availableFrom'
  //       ? formatDateForAPI(formattedValue)
  //       : formattedValue;

  //   if (page === 'edit') {
  //     dispatch(
  //       updateEditPropertyDetails({
  //         [name]: type === 'checkbox' ? checked : formattedValue,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       updateAddPropertyDetails({
  //         [name]: type === 'checkbox' ? checked : formattedValue,
  //       })
  //     );
  //   }

  //   setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));

  //   if (name === 'floorNumbers' || name === 'totalFloor') {
  //     validateForm();
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (type === 'number') {
      formattedValue = Number(value) < 0 ? '0' : value;
    }

    formattedValue =
      name === 'availableFrom'
        ? formatDateForAPI(formattedValue)
        : formattedValue;

    if (
      ['maidCharges', 'cookCharges', 'wifiCharges', 'otherCharges'].includes(
        name
      )
    ) {
      setAdditionalCharges((prevCharges) => ({
        ...prevCharges,
        [name]: Number(formattedValue),
      }));

      const totalMaintenanceCharges =
        (additionalCharges.maidCharges || 0) +
        (additionalCharges.cookCharges || 0) +
        (additionalCharges.wifiCharges || 0) +
        (additionalCharges.otherCharges || 0) +
        Number(formattedValue) -
        (additionalCharges[name] || 0);

      if (page === 'edit') {
        dispatch(
          updateEditPropertyDetails({
            maintenanceCharges: String(totalMaintenanceCharges),
          })
        );
      } else {
        dispatch(
          updateAddPropertyDetails({
            maintenanceCharges: String(totalMaintenanceCharges),
          })
        );
      }
    } else {
      if (page === 'edit') {
        dispatch(
          updateEditPropertyDetails({
            [name]: type === 'checkbox' ? checked : formattedValue,
          })
        );
      } else {
        dispatch(
          updateAddPropertyDetails({
            [name]: type === 'checkbox' ? checked : formattedValue,
          })
        );
      }
    }

    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));

    if (name === 'floorNumbers' || name === 'totalFloor') {
      validateForm();
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatDateForAPI(date.toISOString());
      if (page === 'edit') {
        dispatch(updateEditPropertyDetails({ availableFrom: formattedDate }));
      } else {
        dispatch(updateAddPropertyDetails({ availableFrom: formattedDate }));
      }
    }
    setFieldErrors((prevErrors) => ({ ...prevErrors, availableFrom: false }));
  };

  useEffect(() => {
    if (auth?.role === 'FLAT_MATES') {
      if (page === 'edit') {
        dispatch(updateEditPropertyDetails({ isPreoccupied: true }));
      } else {
        dispatch(updateAddPropertyDetails({ isPreoccupied: true }));
      }
    }
  }, [auth?.role]);

  const resetPropertyDetails = () => {
    const defaultState = {
      propertyType: propertyDetails.propertyType,
      roomType: '',
      sharingType: '',
      units: '',
      roomSize: '',
      preoccupiedPropertyType:
        auth?.role === 'FLAT_MATES'
          ? ''
          : propertyDetails.preoccupiedPropertyType,
      configuration: '',
      bedrooms: '',
      preferredGender: [],
      bathrooms: '',
      balconies: '',
      maintenanceCharges: '',
      furnishing: '',
      availableFrom: '',
      price: '',
      security: '',
      lockInPeriod: '',
      brokerage: '',
      preferredTenant: [],
      floorNumber: '',
      totalFloors: '',
      isNegotiable: false,
      amenities: [],
      furnishingExtras: [],
      features: [],
      title: propertyDetails.title,
      description: propertyDetails.description,
    };

    if (page === 'edit') {
      dispatch(updateEditPropertyDetails(defaultState));
    } else {
      dispatch(updateAddPropertyDetails(defaultState));
    }
  };

  const handleButtonClick = (name: string, value: string) => {
    if (name === 'propertyType' && !isNextClicked) {
      resetPropertyDetails();
    }

    if (name === 'preoccupiedPropertyType' && !isNextClicked) {
      resetPropertyDetails();
    }

    if (name === 'preferredGender') {
      // Handle gender as an array with a single value
      if (page === 'edit') {
        dispatch(updateEditPropertyDetails({ preferredGender: [value] }));
      } else {
        dispatch(updateAddPropertyDetails({ preferredGender: [value] }));
      }
    } else {
      if (page === 'edit') {
        dispatch(updateEditPropertyDetails({ [name]: value }));
      } else {
        dispatch(updateAddPropertyDetails({ [name]: value }));
      }
    }

    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleAmenityClick = (value: string) => {
    const isSelected = propertyDetails.amenities.includes(value);
    let updatedAmenities;

    if (isSelected) {
      updatedAmenities = propertyDetails.amenities.filter(
        (item) => item !== value
      );
    } else {
      updatedAmenities = [...propertyDetails.amenities, value];
    }
    if (page === 'edit') {
      dispatch(updateEditPropertyDetails({ amenities: updatedAmenities }));
    } else {
      dispatch(updateAddPropertyDetails({ amenities: updatedAmenities }));
    }
    setFieldErrors((prevErrors) => ({ ...prevErrors, amenities: false }));
  };

  const handleFurnishingClick = (value: string) => {
    const isSelected = propertyDetails.furnishingExtras.includes(value);
    let updatedFurnishings;

    if (isSelected) {
      updatedFurnishings = propertyDetails.furnishingExtras.filter(
        (item) => item !== value
      );
    } else {
      updatedFurnishings = [...propertyDetails.furnishingExtras, value];
    }

    if (page === 'edit') {
      dispatch(
        updateEditPropertyDetails({ furnishingExtras: updatedFurnishings })
      );
    } else {
      dispatch(
        updateAddPropertyDetails({ furnishingExtras: updatedFurnishings })
      );
    }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      furnishingExtras: false,
    }));
  };

  const handleTenantClick = (value: string) => {
    const isSelected = propertyDetails.preferredTenant.includes(value);
    let updatedTenants;

    if (isSelected) {
      updatedTenants = propertyDetails.preferredTenant.filter(
        (item) => item !== value
      );
    } else {
      updatedTenants = [...propertyDetails.preferredTenant, value];
    }
    if (page === 'edit') {
      dispatch(updateEditPropertyDetails({ preferredTenant: updatedTenants }));
    } else {
      dispatch(updateAddPropertyDetails({ preferredTenant: updatedTenants }));
    }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      preferredTenantType: false,
    }));
  };

  const handleFeatureClick = (value: string) => {
    const isSelected = propertyDetails.features.includes(value);
    let updatedFeatures;

    if (isSelected) {
      updatedFeatures = propertyDetails.features.filter(
        (item) => item !== value
      );
    } else {
      updatedFeatures = [...propertyDetails.features, value];
    }
    if (page === 'edit') {
      dispatch(updateEditPropertyDetails({ features: updatedFeatures }));
    } else {
      dispatch(updateAddPropertyDetails({ features: updatedFeatures }));
    }
    setFieldErrors((prevErrors) => ({ ...prevErrors, features: false }));
  };

  const getPropetyTypes = (role: string) => {
    switch (role) {
      case 'BROKER':
        return [
          {
            label: 'Builder Floor',
            value: 'BUILDER_FLOOR',
            url: '/svg/builder.svg',
          },
          { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
          { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
          { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
          {
            label: 'Flat/Apartment',
            value: 'FLAT_APARTMENT',
            url: '/svg/flat.svg',
          },
        ];
      case 'PROPERTY_OWNER':
        return [
          {
            label: 'Builder Floor',
            value: 'BUILDER_FLOOR',
            url: '/svg/builder.svg',
          },
          { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
          {
            label: 'Flat/Apartment',
            value: 'FLAT_APARTMENT',
            url: '/svg/flat.svg',
          },
        ];
      case 'PG_OWNER':
        return [
          { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
          { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
        ];
      case 'CO_LIVING_OWNER':
        return [
          { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
          { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
        ];
      default:
        return [
          {
            label: 'Builder Floor',
            value: 'BUILDER_FLOOR',
            url: '/svg/builder.svg',
          },
          { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
          { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
          { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
          {
            label: 'Flat/Apartment',
            value: 'FLAT_APARTMENT',
            url: '/svg/flat.svg',
          },
        ];
    }
  };

  const getRoomTypes = (propertyType) => {
    switch (propertyType) {
      case 'CO_LIVING':
        return [
          { label: '1 RK', value: 'ONE_RK' },
          { label: '1 Room', value: 'ONE_ROOM' },
        ];
      case 'PG':
        return [
          { label: 'Single', value: 'SINGLE' },
          { label: 'Shared', value: 'SHARED' },
        ];
      default:
        return [
          { label: '1 RK', value: 'ONE_RK' },
          { label: '1 Room', value: 'ONE_ROOM' },
        ];
    }
  };

  const getShareTypes = (propertyType) => {
    switch (propertyType) {
      case 'CO_LIVING':
        return [
          { label: 'Single', value: 'SINGLE' },
          { label: 'Shared', value: 'SHARED' },
        ];
      case 'PG':
        return [
          { label: 'Double Sharing', value: 'DOUBLE_SHARING' },
          { label: 'Triple Sharing', value: 'TRIPPLE_SHARING' },
        ];
      default:
        return [
          { label: 'Single', value: 'SINGLE' },
          { label: 'Shared', value: 'SHARED' },
        ];
    }
  };

  const furnishingLevels = [
    { label: 'Fully Furnished', value: 'FULLY_FURNISHED' },
    { label: 'Semi Furnished', value: 'SEMI_FURNISHED' },
    { label: 'Unfurnished', value: 'NONE' },
  ];

  const getFeature = (propertyType) => {
    if (propertyDetails.isPreoccupied) {
      switch (propertyType) {
        case 'CO_LIVING':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Balcony', value: 'BALCONY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
        case 'PG':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Balcony', value: 'BALCONY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
        case 'BUILDER_FLOOR':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Gated Community', value: 'GATED_COMMUNITY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
        case 'FLAT_APARTMENT':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Gated Community', value: 'GATED_COMMUNITY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
        default:
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Balcony', value: 'BALCONY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
      }
    } else {
      switch (propertyType) {
        case 'CO_LIVING':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Balcony', value: 'BALCONY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
        case 'PG':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Balcony', value: 'BALCONY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
        case 'BUILDER_FLOOR':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Gated Community', value: 'GATED_COMMUNITY' },
          ];
        case 'FLAT_APARTMENT':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Gated Community', value: 'GATED_COMMUNITY' },
          ];
        case 'VILLA':
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Gated Community', value: 'GATED_COMMUNITY' },
          ];
        default:
          return [
            { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
            { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
            { label: 'Owner Free', value: 'OWNER_FREE' },
            { label: 'Balcony', value: 'BALCONY' },
            { label: 'Attached Bathroom', value: 'ATTACHED_BATHROOM' },
          ];
      }
    }
  };

  const configuration = [
    { label: '1 RK', value: 'ONE_RK' },
    { label: '1 BHK', value: 'ONE_BHK' },
    { label: '2 BHK', value: 'TWO_BHK' },
    { label: '3 BHK', value: 'THREE_BHK' },
    { label: '4 BHK', value: 'FOUR_BHK' },
    { label: '4+ BHK', value: 'FOUR_PLUS_BHK' },
  ];

  const RoomFurnishing = [
    {
      label: 'AC',
      value: 'AC',
      url: '/svg/mynaui_air-conditioner-solid.svg',
    },
    {
      label: 'Bed',
      value: 'BED',
      url: '/svg/material-symbols_bed-rounded.svg',
    },
    {
      label: 'Cupboard',
      value: 'CUPBOARD',
      url: '/svg/mdi_wardrobe.svg',
    },
    {
      label: 'Study Table',
      value: 'TABLE',
      url: '/svg/material-symbols_table-bar-rounded.svg',
    },
    {
      label: 'Chair',
      value: 'CHAIR',
      url: '/svg/chair.svg',
    },
    {
      label: 'Geyser',
      value: 'GEYSER',
      url: '/svg/mdi_electric-water-heater.svg',
    },
    {
      label: 'Exhaust',
      value: 'EXHAUST',
      url: '/svg/exhaust.svg',
    },
    {
      label: 'Mattress',
      value: 'MATTRESS',
      url: '/svg/mattress.svg',
    },
  ];

  const HouseFurnishing = [
    {
      label: 'Water Purifier',
      value: 'WATER_PURIFIER',
      url: '/svg/material-symbols_water-loss.svg',
    },
    {
      label: 'TV',
      value: 'TV',
      url: '/svg/mynaui_tv-solid.svg',
    },
    {
      label: 'Sofa',
      value: 'SOFA',
      url: '/svg/solar_sofa-bold.svg',
    },
    {
      label: 'Fridge',
      value: 'FRIDGE',
      url: '/svg/mdi_fridge-outline.svg',
    },
    {
      label: 'Dining table',
      value: 'DINING_TABLE',
      url: '/svg/game-icons_round-table.svg',
    },
  ];

  const getFurnishings = (propertyType) => {
    switch (propertyType) {
      case 'CO_LIVING':
        return [
          {
            label: 'Water Purifier',
            value: 'WATER_PURIFIER',
            url: '/svg/material-symbols_water-loss.svg',
          },
          {
            label: 'Cupboard',
            value: 'CUPBOARD',
            url: '/svg/mdi_wardrobe.svg',
          },
          {
            label: 'Geyser',
            value: 'GEYSER',
            url: '/svg/mdi_electric-water-heater.svg',
          },
          { label: 'Fan', value: 'FAN', url: '/svg/fan.svg' },
          {
            label: 'Microwave',
            value: 'MICROWAVE',
            url: '/svg/material-symbols_microwave.svg',
          },
          {
            label: 'Bed',
            value: 'BED',
            url: '/svg/material-symbols_bed-rounded.svg',
          },
          { label: 'Sofa', value: 'SOFA', url: '/svg/solar_sofa-bold.svg' },
          {
            label: 'Dining table',
            value: 'DINING_TABLE',
            url: '/svg/game-icons_round-table.svg',
          },
          {
            label: 'AC',
            value: 'AC',
            url: '/svg/mynaui_air-conditioner-solid.svg',
          },
          { label: 'TV', value: 'TV', url: '/svg/mynaui_tv-solid.svg' },
          {
            label: 'Washing Machine',
            value: 'WASHING_MACHINE',
            url: '/svg/icon-park-solid_washing-machine.svg',
          },
          {
            label: 'Fridge',
            value: 'FRIDGE',
            url: '/svg/mdi_fridge-outline.svg',
          },
          {
            label: 'Table',
            value: 'TABLE',
            url: '/svg/material-symbols_table-bar-rounded.svg',
          },
        ];
      case 'PG':
        return [
          {
            label: 'Water Purifier',
            value: 'WATER_PURIFIER',
            url: '/svg/material-symbols_water-loss.svg',
          },
          {
            label: 'Cupboard',
            value: 'CUPBOARD',
            url: '/svg/mdi_wardrobe.svg',
          },
          {
            label: 'Geyser',
            value: 'GEYSER',
            url: '/svg/mdi_electric-water-heater.svg',
          },
          {
            label: 'Fan',
            value: 'FAN',
            url: '/svg/fan.svg',
          },
          {
            label: 'Microwave',
            value: 'MICROWAVE',
            url: '/svg/material-symbols_microwave.svg',
          },
          {
            label: 'Bed',
            value: 'BED',
            url: '/svg/material-symbols_bed-rounded.svg',
          },
          {
            label: 'Sofa',
            value: 'SOFA',
            url: '/svg/solar_sofa-bold.svg',
          },
          {
            label: 'Chair',
            value: 'CHAIR',
            url: '/svg/chair.svg',
          },
          {
            label: 'Dining table',
            value: 'DINING_TABLE',
            url: '/svg/game-icons_round-table.svg',
          },
          {
            label: 'AC',
            value: 'AC',
            url: '/svg/mynaui_air-conditioner-solid.svg',
          },
          {
            label: 'TV',
            value: 'TV',
            url: '/svg/mynaui_tv-solid.svg',
          },
          {
            label: 'Washing Machine',
            value: 'WASHING_MACHINE',
            url: '/svg/icon-park-solid_washing-machine.svg',
          },
          {
            label: 'Fridge',
            value: 'FRIDGE',
            url: '/svg/mdi_fridge-outline.svg',
          },
          {
            label: 'Table',
            value: 'TABLE',
            url: '/svg/material-symbols_table-bar-rounded.svg',
          },
        ];

      default:
        return [
          {
            label: 'Water Purifier',
            value: 'WATER_PURIFIER',
            url: '/svg/material-symbols_water-loss.svg',
          },
          {
            label: 'Cupboard',
            value: 'CUPBOARD',
            url: '/svg/mdi_wardrobe.svg',
          },
          {
            label: 'Geyser',
            value: 'GEYSER',
            url: '/svg/mdi_electric-water-heater.svg',
          },
          {
            label: 'Fan',
            value: 'FAN',
            url: '/svg/fan.svg',
          },
          {
            label: 'Microwave',
            value: 'MICROWAVE',
            url: '/svg/material-symbols_microwave.svg',
          },
          {
            label: 'Bed',
            value: 'BED',
            url: '/svg/material-symbols_bed-rounded.svg',
          },
          {
            label: 'Sofa',
            value: 'SOFA',
            url: '/svg/solar_sofa-bold.svg',
          },
          {
            label: 'Dining table',
            value: 'DINING_TABLE',
            url: '/svg/game-icons_round-table.svg',
          },
          {
            label: 'AC',
            value: 'AC',
            url: '/svg/mynaui_air-conditioner-solid.svg',
          },
          {
            label: 'TV',
            value: 'TV',
            url: '/svg/mynaui_tv-solid.svg',
          },
          {
            label: 'Washing Machine',
            value: 'WASHING_MACHINE',
            url: '/svg/icon-park-solid_washing-machine.svg',
          },
          {
            label: 'Fridge',
            value: 'FRIDGE',
            url: '/svg/mdi_fridge-outline.svg',
          },
          {
            label: 'Table',
            value: 'TABLE',
            url: '/svg/material-symbols_table-bar-rounded.svg',
          },
        ];
    }
  };

  const propertyOptions = [
    { label: 'Builder Floor', value: 'BUILDER_FLOOR', url: '/svg/builder.svg' },
    { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
    { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
    { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
    { label: 'Flat/Apartment', value: 'FLAT_APARTMENT', url: '/svg/flat.svg' },
  ];

  const preoccupiedpropertyOptions = [
    {
      label: 'Builder Floor',
      value: 'BUILDER_FLOOR',
      url: '/svg/builder.svg',
    },
    { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
    { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
    {
      label: 'Flat/Apartment',
      value: 'FLAT_APARTMENT',
      url: '/svg/flat.svg',
    },
  ];

  const lockInPeriod = [
    { label: '15 Days', value: 'FIFTEEN_DAYS', url: '/svg/builder.svg' },
    { label: '1 Month', value: 'ONE_MONTH', url: '/svg/villa.svg' },
    { label: '3 Months', value: 'THREE_MONTHS', url: '/svg/coliving.svg' },
    { label: '6 Months', value: 'SIX_MONTHS', url: '/svg/PG.svg' },
  ];

  const gender = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Open to both', value: 'OTHER' },
  ];

  const getAmenitiesList = (property) => {
    if (
      property.propertyType === 'VILLA' ||
      property.propertyType === 'BUILDER_FLOOR' ||
      property.propertyType === 'FLAT_APARTMENT' ||
      property.preoccupiedPropertyType === 'VILLA' ||
      property.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
      property.preoccupiedPropertyType === 'FLAT_APARTMENT'
    ) {
      return [
        { label: 'Wifi', value: 'WIFI', url: '/svg/material-symbols_wifi.svg' },
        {
          label: 'Power Backup',
          value: 'POWER_BACKUP',
          url: '/svg/ic_round-power.svg',
        },
        {
          label: '4 Wheeler Parking',
          value: 'FOUR_WHEELER_PARKING',
          url: '/svg/fluent_vehicle-car-parking-16-regular.svg',
        },
        {
          label: '2 Wheeler Parking',
          value: 'TWO_WHEELER_PARKING',
          url: '/svg/material-symbols_directions-bike.svg',
        },
        {
          label: '24/7 Water Supply',
          value: 'WATER_SUPPLY_24_7',
          url: '/svg/famicons_water-sharp.svg',
        },
        {
          label: '24/7 Security',
          value: 'SECURITY_24_7',
          url: '/svg/healthicons_security-worker.svg',
        },
        {
          label: '24/7 CCTV Surveillance',
          value: 'CCTV',
          url: '/svg/ph_security-camera-fill.svg',
        },
      ];
    } else {
      return [
        { label: 'Wifi', value: 'WIFI', url: '/svg/material-symbols_wifi.svg' },
        {
          label: 'Power Backup',
          value: 'POWER_BACKUP',
          url: '/svg/ic_round-power.svg',
        },
        {
          label: '4 Wheeler Parking',
          value: 'FOUR_WHEELER_PARKING',
          url: '/svg/fluent_vehicle-car-parking-16-regular.svg',
        },
        {
          label: '2 Wheeler Parking',
          value: 'TWO_WHEELER_PARKING',
          url: '/svg/material-symbols_directions-bike.svg',
        },
        {
          label: '24/7 Water Supply',
          value: 'WATER_SUPPLY_24_7',
          url: '/svg/famicons_water-sharp.svg',
        },
        {
          label: '24/7 Security',
          value: 'SECURITY_24_7',
          url: '/svg/healthicons_security-worker.svg',
        },
        {
          label: 'Daily House Keeping',
          value: 'DAILY_HOUSEKEEPING',
          url: '/svg/material-symbols-light_cleaning-bucket-rounded.svg',
        },
        {
          label: '24/7 CCTV Surveillance',
          value: 'CCTV',
          url: '/svg/ph_security-camera-fill.svg',
        },
        {
          label: 'Meals',
          value: 'MEALS',
          url: '/svg/fluent_food-24-filled.svg',
        },
      ];
    }
  };

  const getTenantType = (propertyType) => {
    switch (propertyType) {
      case 'CO_LIVING':
        return [];
      case 'PG':
        return [
          { label: 'Family', value: 'FAMILY' },
          { label: 'Bachelors', value: 'BACHELOR' },
          { label: 'Company Lease', value: 'COMPANY_LEASE' },
          { label: 'Any', value: 'ANY' },
        ];
      case 'BUILDER_FLOOR':
        return [
          { label: 'Family', value: 'FAMILY' },
          { label: 'Bachelors', value: 'BACHELOR' },
          { label: 'Company Lease', value: 'COMPANY_LEASE' },
          { label: 'Any', value: 'ANY' },
        ];
      case 'FLAT_APARTMENT':
        return [
          { label: 'Family', value: 'FAMILY' },
          { label: 'Bachelors', value: 'BACHELOR' },
          { label: 'Company Lease', value: 'COMPANY_LEASE' },
          { label: 'Any', value: 'ANY' },
        ];
      default:
        return [
          { label: 'Family', value: 'FAMILY' },
          { label: 'Bachelors', value: 'BACHELOR' },
          { label: 'Company Lease', value: 'COMPANY_LEASE' },
          { label: 'Any', value: 'ANY' },
        ];
    }
  };

  const getRequiredFields = (propertyDetails) => {
    const commonFields = [
      'title',
      'description',
      'furnishing',
      'availableFrom',
      'price',
      'security',
      'lockInPeriod',
      'brokerage',
    ];

    if (propertyDetails.isPreoccupied) {
      switch (propertyDetails.propertyType) {
        case 'BUILDER_FLOOR':
          return [
            ...commonFields,
            'configuration',
            'preferredTenant',
            'floorNumber',
            'totalFloors',
          ];
        case 'FLAT_APARTMENT':
          return [
            ...commonFields,
            'configuration',
            'maintenanceCharges',
            'preferredTenant',
            'floorNumber',
            'totalFloors',
          ];
        case 'VILLA':
          return [...commonFields, 'preferredTenant'];
        case 'CO_LIVING':
          return [...commonFields, 'roomType', 'unitsAvailable'];
        case 'PG':
          return [...commonFields, 'roomType', 'unitsAvailable'];
        default:
          return commonFields;
      }
    } else {
      switch (propertyDetails.propertyType) {
        case 'CO_LIVING':
          return [
            ...commonFields,
            'propertyType',
            'roomType',
            'unitsAvailable',
          ];
        case 'VILLA':
          return [...commonFields, 'propertyType', 'preferredTenant'];
        case 'PG':
          return [
            ...commonFields,
            'propertyType',
            'roomType',
            'unitsAvailable',
          ];
        case 'BUILDER_FLOOR':
          return [
            ...commonFields,
            'configuration',
            'propertyType',
            'preferredTenant',
            'floorNumber',
            'totalFloors',
          ];
        case 'FLAT_APARTMENT':
          return [
            ...commonFields,
            'configuration',
            'propertyType',
            'maintenanceCharges',
            'preferredTenant',
            'floorNumber',
            'totalFloors',
          ];
        default:
          return commonFields;
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = getRequiredFields(propertyDetails);

    requiredFields.forEach((field) => {
      const value = propertyDetails[field];
      if (Array.isArray(value)) {
        errors[field] = value.length === 0;
      } else {
        errors[field] = !value;
      }
    });

    const floorNumber = parseInt(propertyDetails.floorNumber);
    const totalFloors = parseInt(propertyDetails.totalFloors);

    if (
      !isNaN(floorNumber) &&
      !isNaN(totalFloors) &&
      floorNumber > totalFloors
    ) {
      errors['floorNumber'] = true;
      errors['totalFloors'] = true;
      setFloorError('Floor number must be less than or equal to total floors');
    } else {
      setFloorError('');
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    setFieldErrors(errors);

    const errorFields = Object.keys(errors).filter((key) => errors[key]);

    if (errorFields.length > 0) {
      return;
    }

    setIsNextClicked(true);
    handleNext();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = async () => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }
      const changedFields = {};

      if (initialPropertyDetails.current) {
        for (const key in propertyDetails) {
          if (
            !isEqual(propertyDetails[key], initialPropertyDetails.current[key])
          ) {
            changedFields[key] = propertyDetails[key];
          }
        }
        console.log(changedFields);
        if (Object.keys(changedFields).length > 0) {
          const response = await axios.patch(
            `https://api.houzie.in/listings/${editingListingId}`,
            changedFields,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.status === 200) {
            toast.success({
              title: 'Success!',
              description: 'Listing Updated Successfully',
            });
            handleNext();
          } else {
            toast.info({
              title: 'Information',
              description:
                'This is an informational notification with the requested color scheme.',
            });
            toast.error({
              title: 'Error',
              description: 'Failed to update listing Please Try again later',
            });
          }
        } else {
          toast.info({
            title: 'No changes',
            description: 'No changes were made to the property details.',
          });
          handleNext();
        }
      } else {
        toast.info({
          title: 'No changes',
          description: 'Initial property details are not available',
        });
      }
    } catch (error) {
      toast.error({
        title: 'Edit Failed',
        description: 'There was a problem while editing please try again later',
      });
    }
  };

  useEffect(() => {
    if (page === 'edit') {
      setIsFormValid(true);
      return;
    }

    const isValid = getRequiredFields(propertyDetails).every((field) => {
      const value = propertyDetails[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    });

    setIsFormValid(isValid);
  }, [propertyDetails, page]);

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      return '';
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (page === 'edit') {
      dispatch(updateEditPropertyDetails({ [name]: value }));
    } else {
      dispatch(updateAddPropertyDetails({ [name]: value }));
    }
  };

  return (
    <Card className='w-full max-w-4xl my-6 md:my-0 mx-auto md:p-8'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Property Details</CardTitle>
        <CardDescription>Enter details about the property.</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-6 '>
        <div className=''>
          <div className=''>
            <CustomInput
              label='Title'
              type='text'
              name='title'
              id='title'
              value={propertyDetails.title}
              onChange={handleInputChange}
              error={fieldErrors['title'] ? 'This field is required' : ''}
              className={cn(
                'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                {
                  'ring-2 ring-red-500 ring-offset-1': fieldErrors['title'],
                }
              )}
              placeholder='Enter Property title'
              required
            />
          </div>
        </div>
        <div className=''>
          <div className=''>
            <CustomInput
              type='text'
              name='description'
              label='Description'
              id='description'
              value={propertyDetails.description}
              onChange={handleInputChange}
              error={fieldErrors['description'] ? 'This field is required' : ''}
              className={cn(
                'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                {
                  'ring-2 ring-red-500 ring-offset-1':
                    fieldErrors['description'],
                }
              )}
              placeholder='Enter Property Description'
              required
            />
          </div>
        </div>

        {/* Property Type */}
        {auth?.role !== 'FLAT_MATES' && (
          <div className=''>
            <Label className='text-md text-black font-normal'>
              Property Type<span className='text-red-500'>*</span>
            </Label>
            <div className='flex flex-wrap gap-2 mt-2'>
              {getPropetyTypes(auth?.role || '').map((type) => (
                <Button
                  key={type.value}
                  className={cn(
                    'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                    propertyDetails.propertyType === type.value
                      ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                      : 'bg-white text-[#646464] border-gray-300 hover:bg-gray-100'
                  )}
                  onClick={() => handleButtonClick('propertyType', type.value)}
                  disabled={page === 'edit'}
                >
                  <Image
                    src={type.url}
                    alt={type.label}
                    width={55}
                    height={55}
                    className={`object-contain `}
                  />
                  <div className=' text-center text-wrap'>{type.label}</div>
                </Button>
              ))}
            </div>
            {fieldErrors['propertyType'] && (
              <p className='text-red-500 text-sm mt-1'>
                Please select a Property Type
              </p>
            )}
          </div>
        )}

        {(propertyDetails.propertyType === 'CO_LIVING' ||
          propertyDetails.propertyType === 'VILLA' ||
          propertyDetails.propertyType === 'PG' ||
          propertyDetails.propertyType === 'BUILDER_FLOOR' ||
          propertyDetails.propertyType === 'FLAT_APARTMENT' ||
          propertyDetails.isPreoccupied) && (
          <div className='transition-opacity duration-500 ease-in-out flex flex-col gap-6'>
            {propertyDetails.isPreoccupied && (
              <>
                <div className='w-full'>
                  <Label className='text-md text-black font-normal'>
                    Property Type
                    <span className='text-red-500'>*</span>
                  </Label>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {preoccupiedpropertyOptions.map((type) => (
                      <Button
                        key={type.value}
                        className={cn(
                          'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                          propertyDetails.preoccupiedPropertyType === type.value
                            ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                            : 'bg-white text-[#646464] border-gray-300 hover:bg-gray-100'
                        )}
                        onClick={() =>
                          handleButtonClick(
                            'preoccupiedPropertyType',
                            type.value
                          )
                        }
                        disabled={page === 'edit'}
                      >
                        <Image
                          src={type.url}
                          alt={type.label}
                          width={55}
                          height={55}
                          className={`object-contain `}
                        />
                        <div className=' text-center text-wrap'>
                          {type.label}
                        </div>
                      </Button>
                    ))}
                  </div>
                  {fieldErrors['propertyType'] && (
                    <p className='text-red-500 text-sm mt-1'>
                      Please select a Property Type
                    </p>
                  )}
                </div>
                {/* <div className='flex flex-col'>
                  <Label className='text-lg font-bold mb-2'>
                    Preoccupied Property Type
                    <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={propertyDetails.preoccupiedPropertyType}
                    onValueChange={(value) => {
                      handleSelectChange('preoccupiedPropertyType', value);
                      setFieldErrors((prevErrors) => ({
                        ...prevErrors,
                        preoccupiedPropertyType: false,
                      }));
                    }}
                    required
                  >
                    <SelectTrigger className='w-full border focus:ring-0 ring-offset-transparent focus:border-none focus:ring-offset-0'>
                      <SelectValue placeholder='Select a preoccupied property type' />
                    </SelectTrigger>
                    <SelectContent>
                      {preoccupiedpropertyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className='flex items-center'>
                            <Image
                              src={option.url}
                              alt={option.label}
                              width={20}
                              height={20}
                              className='mr-2'
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors['preoccupiedPropertyType'] && (
                    <p className='text-red-500 text-sm mt-1'>
                      Please select a preoccupied property type
                    </p>
                  )}
                </div> */}
              </>
            )}

            <div className='flex flex-wrap gap-6'>
              {/* Monthly Rent */}
              <div className='w-full lg:w-[48%]'>
                <CustomInput
                  type='number'
                  name='price'
                  id='price'
                  label='Monthly Rent'
                  onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                  value={propertyDetails.price}
                  onChange={handleInputChange}
                  error={fieldErrors['price'] ? 'This field is required' : ''}
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1': fieldErrors['price'],
                    }
                  )}
                  placeholder='Enter Monthly Rent'
                  required
                />
              </div>

              {/* Security Deposit */}
              <div className='w-full lg:w-[48%]'>
                <CustomInput
                  type='number'
                  name='security'
                  id='security'
                  onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                  label='Security Deposit'
                  value={propertyDetails.security}
                  onChange={handleInputChange}
                  error={
                    fieldErrors['security'] ? 'This field is required' : ''
                  }
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1':
                        fieldErrors['security'],
                    }
                  )}
                  placeholder='Enter Security Deposit'
                  required
                />
              </div>
            </div>

            {/* Maintenance Charges */}
            {(propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT') && (
              <div className='w-full grid grid-cols-1'>
                <Label className='text-md text-black font-normal mb-2'>
                  Maintenance Charge
                </Label>
                <div className='ml-6 col-span-1 grid grid-cols-2 gap-4'>
                  <CustomInput
                    type='number'
                    name='maidCharges'
                    id='maidCharges'
                    label='Maid (Cleaning + Utensils)'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={additionalCharges.maidCharges || ''}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['maidCharges'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] col-span-1 text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['maidCharges'],
                      }
                    )}
                    placeholder='Maid Charges (per month)'
                  />

                  <CustomInput
                    type='number'
                    name='cookCharges'
                    id='cookCharges'
                    label='Cook'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={additionalCharges.cookCharges || ''}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['cookCharges'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] col-span-1 text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['cookCharges'],
                      }
                    )}
                    placeholder='Cook Charges (per month)'
                  />

                  <CustomInput
                    type='number'
                    name='wifiCharges'
                    id='wifiCharges'
                    label='Wifi'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={additionalCharges.wifiCharges || ''}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['wifiCharges'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] col-span-1 text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['wifiCharges'],
                      }
                    )}
                    placeholder='Wifi Charges (per month)'
                  />

                  <CustomInput
                    type='number'
                    name='otherCharges'
                    id='otherCharges'
                    label='Any Other'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={additionalCharges.otherCharges || ''}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['otherCharges']
                        ? 'This field is required'
                        : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] col-span-1 text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['otherCharges'],
                      }
                    )}
                    placeholder='Other Charges (per month)'
                  />
                </div>

                <div className='mt-4 ml-6 col-span-1'>
                  <CustomInput
                    type='number'
                    name='maintenanceCharges'
                    id='maintenanceCharges'
                    label='Total Maintenance Charge'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={propertyDetails.maintenanceCharges || 0}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    error={
                      fieldErrors['maintenanceCharges']
                        ? 'This field is required'
                        : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['maintenanceCharges'],
                      }
                    )}
                    placeholder='Total Maintenance Charges (per month)*'
                    required
                    disabled // Disable editing directly; it's calculated from other fields
                  />
                </div>
              </div>
            )}

            {/* {(propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT') && (
              <div className='w-full'>
                <CustomInput
                  type='number'
                  name='maintenanceCharges'
                  id='maintenanceCharges'
                  label='Maintenance Charge'
                  onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                  value={propertyDetails.maintenanceCharges}
                  onChange={handleInputChange}
                  error={
                    fieldErrors['maintenanceCharges']
                      ? 'This field is required'
                      : ''
                  }
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1':
                        fieldErrors['maintenanceCharges'],
                    }
                  )}
                  placeholder='Maintenance Charges (per month)*'
                  required
                />
              </div>
            )} */}

            {/* Brokerage */}
            <div className='w-full'>
              <CustomInput
                type='number'
                name='brokerage'
                label='Brokerage Amount'
                id='brokerage'
                onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                value={propertyDetails.brokerage}
                onChange={handleInputChange}
                placeholder='Enter Brokerage (In Rupees)'
                required
                error={fieldErrors['brokerage'] ? 'This field is required' : ''}
                className={cn(
                  'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                  {
                    'ring-2 ring-red-500 ring-offset-1':
                      fieldErrors['brokerage'],
                  }
                )}
              />

              <label className='inline-flex items-center mt-3 border px-4 py-2 rounded-md '>
                <Input
                  type='checkbox'
                  name='isNegotiable'
                  checked={propertyDetails.isNegotiable}
                  onChange={handleInputChange}
                  className={cn(
                    'form-checkbox h-5 w-4 text-[#729eff] border-2 focus-visible:border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                    {
                      'ring-2 ring-red-500 ring-offset-1':
                        fieldErrors['isNegotiable'],
                    }
                  )}
                />
                <span className='ml-2 text-gray-700 text-sm'>
                  Brokerage Negotiable
                </span>
              </label>
            </div>

            {/* Number of Units Available */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              propertyDetails.propertyType === 'PG' ||
              propertyDetails.preoccupiedPropertyType === 'CO_LIVING') && (
              <div className=''>
                <div className=''>
                  <CustomInput
                    type='number'
                    name='unitsAvailable'
                    label='Number Of Units Available'
                    id='unitsAvailable'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={propertyDetails.unitsAvailable}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['unitsAvailable']
                        ? 'This field is required'
                        : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['unitsAvailable'],
                      }
                    )}
                    placeholder='Enter Number of Units Available'
                  />
                </div>
              </div>
            )}

            {/* Available From */}

            <div className='w-full flex flex-col'>
              <Label
                htmlFor='availableFrom'
                className='text-md text-black font-normal mb-1'
              >
                Available From<span className='text-red-500'>*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full pl-3 text-left font-normal'
                  >
                    {propertyDetails.availableFrom ? (
                      formatDateForInput(propertyDetails.availableFrom)
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={
                      propertyDetails.availableFrom
                        ? new Date(propertyDetails.availableFrom)
                        : undefined
                    }
                    onDayClick={(date) => {
                      handleDateChange(date);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              {fieldErrors['availableFrom'] && (
                <p className='text-red-500 text-sm mt-1'>
                  Please select an available date
                </p>
              )}
            </div>

            {/* Lock In Period */}
            <div className='w-full'>
              <Label className='text-md text-black font-normal'>
                Lock In Period<span className='text-red-500'>*</span>
              </Label>
              <div className='flex flex-wrap gap-2 mt-1'>
                {lockInPeriod.map((level) => (
                  <Button
                    key={level.value}
                    className={cn(
                      'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                      propertyDetails.lockInPeriod === level.value
                        ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                        : 'bg-white text-[#646464] '
                    )}
                    onClick={() =>
                      handleButtonClick('lockInPeriod', level.value)
                    }
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
              {fieldErrors['lockInPeriod'] && (
                <p className='text-red-500 text-sm mt-1'>
                  Please select a LockIn Period
                </p>
              )}
            </div>

            {/* Room Type */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              propertyDetails.propertyType === 'PG' ||
              propertyDetails.preoccupiedPropertyType === 'CO_LIVING') && (
              <div>
                <Label className='text-md text-black font-normal'>
                  Room Type<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {getRoomTypes(propertyDetails.propertyType).map((type) => (
                    <Button
                      key={type.value}
                      size='custom'
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.roomType === type.value
                          ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-[#646464] '
                      )}
                      onClick={() => handleButtonClick('roomType', type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                {fieldErrors['roomType'] && (
                  <p className='text-red-500 text-sm mt-1'>
                    Please select a Room Type
                  </p>
                )}
              </div>
            )}

            {/* Sharing Type */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              (propertyDetails.preoccupiedPropertyType === 'CO_LIVING' &&
                propertyDetails.isPreoccupied) ||
              (propertyDetails.preoccupiedPropertyType === 'VILLA' &&
                propertyDetails.isPreoccupied) ||
              (propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' &&
                propertyDetails.isPreoccupied) ||
              (propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT' &&
                propertyDetails.isPreoccupied) ||
              propertyDetails.propertyType === 'PG') && (
              <div>
                <Label className='text-md text-black font-normal'>
                  Sharing Type<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {getShareTypes(propertyDetails.propertyType).map((type) => (
                    <Button
                      key={type.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.sharingType === type.value
                          ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-[#646464] '
                      )}
                      onClick={() =>
                        handleButtonClick('sharingType', type.value)
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>{' '}
                {fieldErrors['sharingType'] && (
                  <p className='text-red-500 text-sm mt-1'>
                    Please select a sharing Type
                  </p>
                )}
              </div>
            )}

            {(propertyDetails.propertyType === 'CO_LIVING' ||
              (propertyDetails.preoccupiedPropertyType === 'CO_LIVING' &&
                propertyDetails.isPreoccupied) ||
              (propertyDetails.preoccupiedPropertyType === 'VILLA' &&
                propertyDetails.isPreoccupied) ||
              (propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' &&
                propertyDetails.isPreoccupied) ||
              (propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT' &&
                propertyDetails.isPreoccupied) ||
              propertyDetails.propertyType === 'PG') && (
              <div>
                <Label className='text-md text-black font-normal'>
                  Preferred Gender<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {gender.map((type) => (
                    <Button
                      key={type.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.preferredGender.includes(type.value)
                          ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-[#646464] '
                      )}
                      onClick={() =>
                        handleButtonClick('preferredGender', type.value)
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                {fieldErrors['preferredGender'] && (
                  <p className='text-red-500 text-sm mt-1'>
                    Please select a Gender
                  </p>
                )}
              </div>
            )}

            {/* Configuration */}
            {(propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
              propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT') && (
              <div>
                <Label className='text-md text-black font-normal'>
                  Configuration<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {configuration.map((type) => (
                    <Button
                      key={type.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.configuration === type.value
                          ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-[#646464] '
                      )}
                      onClick={() =>
                        handleButtonClick('configuration', type.value)
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                {fieldErrors['configuration'] && (
                  <p className='text-red-500 text-sm mt-1'>
                    Please select an Configuration
                  </p>
                )}
              </div>
            )}

            {(propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.propertyType === 'VILLA' ||
              propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
              propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT' ||
              propertyDetails.preoccupiedPropertyType === 'VILLA') && (
              <div className='flex justify-between items-center gap-6'>
                <div className='w-full '>
                  <CustomInput
                    type='number'
                    name='bedrooms'
                    id='bedrooms'
                    variant='small'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    label='Bedroom'
                    value={propertyDetails.bedrooms}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['bedrooms'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['bedrooms'],
                      }
                    )}
                    placeholder='Number Of Bedroom'
                    required
                  />
                </div>
                <div className='w-full '>
                  <CustomInput
                    type='number'
                    name='balconies'
                    id='balconies'
                    variant='small'
                    label='Balcony'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={propertyDetails.balconies}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['balconies'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['balconies'],
                      }
                    )}
                    placeholder='Number Of Balcony'
                    required
                  />
                </div>
                <div className='w-full'>
                  <CustomInput
                    type='number'
                    name='bathrooms'
                    variant='small'
                    id='bathrooms'
                    label='Bathroom'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={propertyDetails.bathrooms}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['bedrooms'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe]  ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['bedrooms'],
                      }
                    )}
                    placeholder='Enter Number Of Bathroom'
                    required
                  />
                </div>
              </div>
            )}

            {/* Floor Number */}
            {(propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
              propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT') && (
              <div className='flex flex-col w-full lg:w-[60%]'>
                <Label className='text-black font-normal text-md mb-1'>
                  Floor Number<span className='text-red-500'>*</span>
                </Label>
                <div className='flex justify-start items-center gap-4'>
                  <Input
                    type='number'
                    name='floorNumber'
                    id='floorNumber'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={propertyDetails.floorNumber}
                    onChange={handleInputChange}
                    placeholder='Floor Number'
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['floorNumber'],
                      }
                    )}
                    required
                  />
                  <Label className='font-bold text-md text-[#646464] text-nowrap'>
                    Out Of
                  </Label>
                  <Input
                    type='number'
                    name='totalFloors'
                    id='totalFloors'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={propertyDetails.totalFloors}
                    onChange={handleInputChange}
                    placeholder='Total Floor'
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['totalFloors'],
                      }
                    )}
                    required
                  />
                </div>
                {floorError && (
                  <p className='text-red-500 text-sm mt-1'>{floorError}</p>
                )}
              </div>
            )}

            {/* Features */}
            <div>
              <Label className='text-md text-black font-normal'>Features</Label>
              <div className='flex flex-wrap gap-6 mt-1'>
                {getFeature(propertyDetails.propertyType).map((feature) => (
                  <Button
                    key={feature.value}
                    className={cn(
                      'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                      propertyDetails.features.includes(feature.value)
                        ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                        : 'bg-white text-[#646464] '
                    )}
                    onClick={() => handleFeatureClick(feature.value)}
                  >
                    {feature.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preferred Tenant Type */}
            {(propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.propertyType === 'VILLA' ||
              propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
              propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT' ||
              propertyDetails.preoccupiedPropertyType === 'VILLA') && (
              <div>
                <Label className='text-md text-black font-normal'>
                  Preferred Tenant Type
                  <span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-6 mt-1'>
                  {getTenantType(propertyDetails.propertyType).map((tenant) => (
                    <Button
                      key={tenant.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.preferredTenant.includes(tenant.value)
                          ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-[#646464] '
                      )}
                      onClick={() => handleTenantClick(tenant.value)}
                    >
                      {tenant.label}
                    </Button>
                  ))}
                </div>
                {fieldErrors['preferredTenant'] && (
                  <p className='text-red-500 text-sm mt-1'>
                    Please select a Tenant Type
                  </p>
                )}
              </div>
            )}

            {/* {propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY' && (
              <div className='w-full lg:w-[48%]'>
                <CustomInput
                  label='Total Number Of Floors'
                  type='number'
                  name='totalfloor'
                  id='totalfloor'
                  placeholder='Enter Number Of Floors'
                  value={propertyDetails.totalfloor}
                  error={
                    fieldErrors['totalfloor'] ? 'This field is required' : ''
                  }
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1':
                        fieldErrors['totalfloor'],
                    }
                  )}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )} */}

            {/* Rooms Size */}
            {/* {propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY' && (
              <div className=''>
                <div className=''>
                  <CustomInput
                    type='number'
                    name='roomSize'
                    label='Room Size'
                    id='roomSize'
                    value={propertyDetails.roomSize}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['roomSize'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['roomSize'],
                      }
                    )}
                    placeholder='Enter Rooms Size'
                  />
                </div>
              </div>
            )} */}

            {/* Furnishing Level */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.propertyType === 'VILLA' ||
              propertyDetails.propertyType === 'PG' ||
              propertyDetails.preoccupiedPropertyType === 'CO_LIVING' ||
              propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
              propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT' ||
              propertyDetails.preoccupiedPropertyType === 'VILLA') && (
              <div>
                <Label className='text-md text-black font-normal'>
                  Furnishing Level<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {furnishingLevels.map((level) => (
                    <Button
                      key={level.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.furnishing === level.value
                          ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-[#646464] '
                      )}
                      onClick={() =>
                        handleButtonClick('furnishing', level.value)
                      }
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
                {fieldErrors['furnishing'] && (
                  <p className='text-red-500 text-sm mt-1'>
                    Please select a furnishing level
                  </p>
                )}
              </div>
            )}

            {/* Furnishings (as array) Not Preoccupied*/}
            {(propertyDetails.furnishing.includes('FULLY_FURNISHED') &&
              (propertyDetails.propertyType === 'CO_LIVING' ||
                propertyDetails.propertyType === 'BUILDER_FLOOR' ||
                propertyDetails.propertyType === 'FLAT_APARTMENT' ||
                propertyDetails.propertyType === 'VILLA' ||
                propertyDetails.propertyType === 'PG' ||
                propertyDetails.preoccupiedPropertyType === 'CO_LIVING')) ||
              (propertyDetails.furnishing.includes('SEMI_FURNISHED') &&
                (propertyDetails.propertyType === 'CO_LIVING' ||
                  propertyDetails.propertyType === 'BUILDER_FLOOR' ||
                  propertyDetails.propertyType === 'FLAT_APARTMENT' ||
                  propertyDetails.propertyType === 'VILLA' ||
                  propertyDetails.propertyType === 'PG' ||
                  propertyDetails.preoccupiedPropertyType === 'CO_LIVING') && (
                  <div>
                    <Label className='text-md text-black font-normal'>
                      Furnishings
                    </Label>
                    <div className='flex flex-wrap gap-4 mt-1'>
                      {getFurnishings(propertyDetails.propertyType).map(
                        (furnishing) => (
                          <Button
                            key={furnishing.value}
                            className={cn(
                              'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors',
                              propertyDetails.furnishingExtras.includes(
                                furnishing.value
                              )
                                ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                                : 'bg-white text-[#646464] border-gray-300 '
                            )}
                            onClick={() =>
                              handleFurnishingClick(furnishing.value)
                            }
                          >
                            <Image
                              src={furnishing.url}
                              alt={furnishing.label}
                              width={55}
                              height={55}
                              className='object-contain'
                            />
                            <div className=' text-center text-wrap'>
                              {furnishing.label}
                            </div>
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                ))}

            {/* Furnishings (as array) Preoccupied*/}
            {(propertyDetails.furnishing.includes('FULLY_FURNISHED') &&
              (propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
                propertyDetails.preoccupiedPropertyType === 'FLAT_APARTMENT' ||
                propertyDetails.preoccupiedPropertyType === 'VILLA')) ||
              (propertyDetails.furnishing.includes('SEMI_FURNISHED') &&
                (propertyDetails.preoccupiedPropertyType === 'BUILDER_FLOOR' ||
                  propertyDetails.preoccupiedPropertyType ===
                    'FLAT_APARTMENT' ||
                  propertyDetails.preoccupiedPropertyType === 'VILLA') && (
                  <>
                    <div>
                      <Label className='text-md text-black font-normal'>
                        Room Furnishings
                      </Label>
                      <div className='flex flex-wrap gap-4 mt-1'>
                        {RoomFurnishing.map((furnishing) => (
                          <Button
                            key={furnishing.value}
                            className={cn(
                              'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors',
                              propertyDetails.furnishingExtras.includes(
                                furnishing.value
                              )
                                ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                                : 'bg-white text-[#646464] border-gray-300 '
                            )}
                            onClick={() =>
                              handleFurnishingClick(furnishing.value)
                            }
                          >
                            <Image
                              src={furnishing.url}
                              alt={furnishing.label}
                              width={55}
                              height={55}
                              className='object-contain'
                            />
                            <div className=' text-center text-wrap'>
                              {furnishing.label}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className='text-md text-black font-normal'>
                        House Furnishings
                      </Label>
                      <div className='flex flex-wrap gap-4 mt-1'>
                        {HouseFurnishing.map((furnishing) => (
                          <Button
                            key={furnishing.value}
                            className={cn(
                              'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors',
                              propertyDetails.furnishingExtras.includes(
                                furnishing.value
                              )
                                ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                                : 'bg-white text-[#646464] border-gray-300 '
                            )}
                            onClick={() =>
                              handleFurnishingClick(furnishing.value)
                            }
                          >
                            <Image
                              src={furnishing.url}
                              alt={furnishing.label}
                              width={55}
                              height={55}
                              className='object-contain'
                            />
                            <div className=' text-center text-wrap'>
                              {furnishing.label}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                ))}

            {/* Amenities */}
            <div>
              <Label className='text-md text-black font-normal'>
                Amenities
              </Label>
              <div className='flex flex-wrap gap-4 mt-1'>
                {getAmenitiesList(propertyDetails).map((amenity) => (
                  <Button
                    key={amenity.value}
                    className={cn(
                      'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors',
                      propertyDetails.amenities.includes(amenity.value)
                        ? 'bg-[#bfd7fe] text-[#646464] shadow-slate-500 border-none shadow-lg'
                        : 'bg-white text-[#646464] border-gray-300 '
                    )}
                    onClick={() => handleAmenityClick(amenity.value)}
                  >
                    <Image
                      src={amenity.url}
                      alt={amenity.label}
                      width={55}
                      height={55}
                      className={`object-contain `}
                    />
                    <div className='text-center text-wrap'>{amenity.label}</div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-4'>
        {page === 'edit' ? (
          <Button
            onClick={handleEdit}
            className='bg-[#f5f5fa] text-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
            // disabled={!isFormValid}
          >
            Edit And Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className='bg-[#f5f5fa] text-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
            // disabled={!isFormValid}
          >
            Next, Add Address
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyDetailsForm;
