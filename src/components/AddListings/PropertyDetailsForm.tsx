'use client';

import axios from 'axios';
import { isEqual } from 'lodash';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib/utils'; // Import cn function
import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import CustomInput from '@/components/inputs/CustomInput';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { PropertyDetailsForminteface } from '@/interfaces/PropsInterface';
import {
  populateEditForm,
  updateAddPropertyDetails,
  updateEditPropertyDetails,
} from '@/redux/slices/formslices';
import { AppDispatch, RootState } from '@/redux/store';

const PropertyDetailsForm = ({
  handleNext,
  handleBack,
  page,
}: PropertyDetailsForminteface) => {
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

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (type === 'number') {
      if (Number(value) < 0) {
        formattedValue = '0';
      }
    }

    formattedValue =
      name === 'availableFrom'
        ? formatDateForAPI(formattedValue)
        : formattedValue;

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
  };

  const handleButtonClick = (name: string, value: string) => {
    if (page === 'edit') {
      dispatch(updateEditPropertyDetails({ [name]: value }));
    } else {
      dispatch(updateAddPropertyDetails({ [name]: value }));
    }
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
  };

  const handleFurnishingClick = (value: string) => {
    const isSelected = propertyDetails.furnishings.includes(value);
    let updatedFurnishings;

    if (isSelected) {
      updatedFurnishings = propertyDetails.furnishings.filter(
        (item) => item !== value
      );
    } else {
      updatedFurnishings = [...propertyDetails.furnishings, value];
    }

    if (page === 'edit') {
      dispatch(updateEditPropertyDetails({ furnishings: updatedFurnishings }));
    } else {
      dispatch(updateAddPropertyDetails({ furnishings: updatedFurnishings }));
    }
  };

  const handleTenantClick = (value: string) => {
    const isSelected = propertyDetails.preferredTenantType.includes(value);
    let updatedTenants;

    if (isSelected) {
      updatedTenants = propertyDetails.preferredTenantType.filter(
        (item) => item !== value
      );
    } else {
      updatedTenants = [...propertyDetails.preferredTenantType, value];
    }
    if (page === 'edit') {
      dispatch(
        updateEditPropertyDetails({ preferredTenantType: updatedTenants })
      );
    } else {
      dispatch(
        updateAddPropertyDetails({ preferredTenantType: updatedTenants })
      );
    }
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
  };

  const propertyTypes = [
    { label: 'Builder Floor', value: 'BUILDER_FLOOR', url: '/svg/builder.svg' },
    { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
    { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
    { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
    {
      label: 'Preoccupied Property',
      value: 'PREOCCUPIED_PROPERTY',
      url: '/svg/preoccupied.svg',
    },
    {
      label: 'Flat/Apartment',
      value: 'FLAT_APARTMENT',
      url: '/svg/flat.svg',
    },
  ];

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
          { label: 'Tripple Sharing', value: 'TRIPPLE_SHARING' },
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
  };

  const configuration = [
    { label: '1 RK', value: 'ONE_RK' },
    { label: '1 BHK', value: 'ONE_BHK' },
    { label: '2 BHK', value: 'TWO_BHK' },
    { label: '3 BHK', value: 'THREE_BHK' },
    { label: '4 BHK', value: 'FOUR_BHK' },
    { label: '4+ BHK', value: 'FOUR_PLUS_BHK' },
  ];

  const getFurnishings = (propertyType) => {
    switch (propertyType) {
      case 'CO_LIVING':
        return [
          {
            label: 'Water Purifier',
            value: 'waterPurifier',
            url: '/svg/water-dispenser.svg',
          },
          { label: 'Cupboard', value: 'cupboard', url: '/svg/cupboard.svg' },
          { label: 'Geyser', value: 'geyser', url: '/svg/geyser.svg' },
          { label: 'Fan', value: 'fan', url: '/svg/fan.svg' },
          { label: 'Microwave', value: 'microwave', url: '/svg/microvawe.svg' },
          { label: 'Bed', value: 'bed', url: '/svg/double bed.svg' },
          { label: 'Sofa', value: 'sofa', url: '/svg/sofa.svg' },
          {
            label: 'Dining table',
            value: 'diningTable',
            url: '/svg/dining.svg',
          },

          { label: 'AC', value: 'ac', url: '/svg/air-conditioning.svg' },
          { label: 'TV', value: 'tv', url: '/svg/tv.svg' },
          {
            label: 'Washing Machine',
            value: 'washing_machine',
            url: '/svg/washing-machine.svg',
          },
          { label: 'Fridge', value: 'fridge', url: '/svg/fridge.svg' },
          { label: 'Table', value: 'table', url: '/svg/table.svg' },
        ];
      case 'PG':
        return [
          {
            label: 'Water Purifier',
            value: 'waterPurifier',
            url: '/svg/water-dispenser.svg',
          },
          { label: 'Cupboard', value: 'cupboard', url: '/svg/cupboard.svg' },
          { label: 'Geyser', value: 'geyser', url: '/svg/geyser.svg' },
          { label: 'Fan', value: 'fan', url: '/svg/fan.svg' },
          { label: 'Microwave', value: 'microwave', url: '/svg/microvawe.svg' },
          {
            label: 'Single Bed',
            value: 'Single_bed',
            url: '/svg/single-bed.svg',
          },
          {
            label: 'Double Bed',
            value: 'Double_bed',
            url: '/svg/double bed.svg',
          },
          { label: 'Sofa', value: 'sofa', url: '/svg/sofa.svg' },
          { label: 'Chair', value: 'Chair', url: '/svg/chair.svg' },
          {
            label: 'Dining table',
            value: 'diningTable',
            url: '/svg/dining.svg',
          },

          { label: 'AC', value: 'ac', url: '/svg/air-conditioning.svg' },
          { label: 'TV', value: 'tv', url: '/svg/tv.svg' },
          {
            label: 'Washing Machine',
            value: 'washing_machine',
            url: '/svg/washing-machine.svg',
          },
          { label: 'Fridge', value: 'fridge', url: '/svg/fridge.svg' },
          { label: 'Table', value: 'table', url: '/svg/table.svg' },
        ];
      default:
        return [
          {
            label: 'Water Purifier',
            value: 'waterPurifier',
            url: '/svg/water-dispenser.svg',
          },
          { label: 'Cupboard', value: 'cupboard', url: '/svg/cupboard.svg' },
          { label: 'Geyser', value: 'geyser', url: '/svg/geyser.svg' },
          { label: 'Fan', value: 'fan', url: '/svg/fan.svg' },
          { label: 'Microwave', value: 'microwave', url: '/svg/microvawe.svg' },
          { label: 'Bed', value: 'bed', url: '/svg/double bed.svg' },
          { label: 'Sofa', value: 'sofa', url: '/svg/sofa.svg' },
          {
            label: 'Dining table',
            value: 'diningTable',
            url: '/svg/dining.svg',
          },

          { label: 'AC', value: 'ac', url: '/svg/air-conditioning.svg' },
          { label: 'TV', value: 'tv', url: '/svg/tv.svg' },
          {
            label: 'Washing Machine',
            value: 'washing_machine',
            url: '/svg/washing-machine.svg',
          },
          { label: 'Fridge', value: 'fridge', url: '/svg/fridge.svg' },
          { label: 'Table', value: 'table', url: '/svg/table.svg' },
        ];
    }
  };

  const propertyOptions = [
    { label: 'Builder Floor', value: 'BUILDER_FLOOR', url: '/svg/builder.svg' },
    { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
    { label: 'Co-living', value: 'CO_LIVING', url: '/svg/coliving.svg' },
    { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
    { label: 'Flat/Apartment', value: 'FLAT_APARTMENT', url: '/svg/flat.svg' },
  ];

  const lockInPeriod = [
    { label: '15 Days', value: 'FIFTEEN_DAYS', url: '/svg/builder.svg' },
    { label: '1 Month', value: 'ONE_MONTH', url: '/svg/villa.svg' },
    { label: '3 Months', value: 'THREE_MONTHS', url: '/svg/coliving.svg' },
    { label: '6 Months', value: 'SIX_MONTHS', url: '/svg/PG.svg' },
  ];

  const amenitiesList = [
    { label: 'Wifi', value: 'WIFI', url: '/svg/wi-fi-icon.svg' },
    { label: 'Power Backup', value: 'POWER_BACKUP', url: '/svg/charge.svg' },
    {
      label: '4 Wheeler Parking',
      value: 'FOUR_WHEELER_PARKING',
      url: '/svg/parking.svg',
    },
    {
      label: '2 Wheeler Parking',
      value: 'TWO_WHEELER_PARKING',
      url: '/svg/parking (1).svg',
    },
    {
      label: '24/7 Water Supply',
      value: 'WATER_SUPPLY_24_7',
      url: '/svg/water supply.svg',
    },
    {
      label: '24/7 Security',
      value: 'SECURITY_24_7',
      url: '/svg/security.svg',
    },
    {
      label: 'Daily House Keeping',
      value: 'DAILY_HOUSEKEEPING',
      url: '/svg/house-keeping.svg',
    },
    {
      label: '24/7 CCTV Surveillance',
      value: 'CCTV',
      url: '/svg/cctv.svg',
    },
    { label: 'Meals', value: 'MEALS', url: '/svg/dinner.svg' },
  ];

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

  const handleSubmit = () => {
    handleNext();
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
            console.log('Listing updated successfully!');
          } else {
            console.error('Failed to update listing:', response.status);
          }
        } else {
          toast({
            title: 'No changes',
            description: 'No changes were made to the property details.',
          });
          handleNext();
        }
      } else {
        console.error('Initial property details are not available');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Edit Failed',
        description: 'Failed To Edit Details',
      });
    }
  };

  useEffect(() => {
    if (page === 'edit') {
      setIsFormValid(true);
      return;
    }
    const getRequiredFields = (propertyType) => {
      switch (propertyType) {
        case 'CO_LIVING':
          return [
            'title',
            'description',
            'propertyType',
            'roomType',
            'units',
            'sharingType',
            'furnishingLevel',
            'monthlyRent',
            'securityDepositamount',
            'lockInPeriodMonths',
            'brokerageAmount',
          ];
        case 'PG':
          return [
            'title',
            'description',
            'propertyType',
            'roomType',
            'sharingType',
            'furnishingLevel',
            'monthlyRent',
            'securityDepositamount',
            'lockInPeriodMonths',
            'brokerageAmount',
            'preferredTenantType',
          ];
        case 'BUILDER_FLOOR':
          return [
            'title',
            'description',
            'propertyType',
            'configuration',
            'bedroom',
            'bathroom',
            'balcony',
            'availableFrom',
            'preferredTenantType',
            'furnishingLevel',
            'floornumber',
            'totalfloor',
            'monthlyRent',
            'maintenanceChargesAmount',
            'securityDepositamount',
            'lockInPeriodMonths',
            'brokerageAmount',
          ];

        case 'VILLA':
          return [
            'title',
            'description',
            'propertyType',
            'preferredTenantType',
            'furnishingLevel',
            'totalfloor',
            'monthlyRent',
            'securityDepositamount',
            'lockInPeriodMonths',
            'brokerageAmount',
          ];

        case 'FLAT_APARTMENT':
          return [
            'title',
            'description',
            'propertyType',
            'configuration',
            'bedroom',
            'bathroom',
            'balcony',
            'availableFrom',
            'preferredTenantType',
            'furnishingLevel',
            'floornumber',
            'totalfloor',
            'monthlyRent',
            'maintenanceChargesAmount',
            'securityDepositamount',
            'lockInPeriodMonths',
            'brokerageAmount',
          ];
        case 'PREOCCUPIED_PROPERTY':
          return [
            'preoccupiedPropertyType',
            'title',
            'description',
            'propertyType',
            'preferredTenantType',
            'furnishingLevel',
            'monthlyRent',
            'securityDepositamount',
            'lockInPeriodMonths',
            'brokerageAmount',
          ];
        default:
          return [
            'title',
            'description',
            'propertyType',
            'roomType',
            'sharingType',
            'configuration',
            'roomSize',
            'roomSizeDetails',
            'bedroom',
            'furnishingLevel',
            'floornumber',
            'totalfloor',
            'preoccupiedPropertyType',
            'furnishings',
            'balcony',
            'mainImage',
            'bathroom',
            'amenities',
            'units',
            'preferredTenantType',
            'features',
            'availableFrom',
            'monthlyRent',
            'maintenanceCharges',
            'maintenanceChargesAmount',
            'securityDeposit',
            'securityDepositamount',
            'lockInPeriod',
            'lockInPeriodMonths',
            'brokerageCharges',
            'brokerageAmount',
            'brokerageNegotiable',
          ];
      }
    };

    const isValid = getRequiredFields(propertyDetails.propertyType).every(
      (field) => {
        const value = propertyDetails[field];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== null && value !== undefined && value !== '';
      }
    );

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
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
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
    <Card className='w-full max-w-4xl my-6 mx-auto md:p-8'>
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
              placeholder='Enter Property Description'
              required
            />
          </div>
        </div>

        {/* Property Type */}
        <div className=''>
          <Label className='text-lg font-bold'>
            Property Type<span className='text-red-500'>*</span>
          </Label>
          <div className='flex flex-wrap gap-6 mt-2'>
            {propertyTypes.map((type) => (
              <Button
                key={type.value}
                className={cn(
                  'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                  propertyDetails.propertyType === type.value
                    ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                )}
                onClick={() => handleButtonClick('propertyType', type.value)}
              >
                <Image
                  src={type.url}
                  alt={type.label}
                  width={55}
                  height={55}
                  className={`object-contain ${
                    propertyDetails.propertyType === type.value
                      ? 'brightness-0 invert'
                      : ''
                  }`}
                />
                <div className='mt-2 text-center text-wrap'>{type.label}</div>
              </Button>
            ))}
          </div>
        </div>

        {(propertyDetails.propertyType === 'CO_LIVING' ||
          propertyDetails.propertyType === 'VILLA' ||
          propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY' ||
          propertyDetails.propertyType === 'PG' ||
          propertyDetails.propertyType === 'BUILDER_FLOOR' ||
          propertyDetails.propertyType === 'FLAT_APARTMENT') && (
          <div className='transition-opacity duration-500 ease-in-out flex flex-col gap-6'>
            {/* Room Type */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              propertyDetails.propertyType === 'PG') && (
              <div>
                <Label className='text-lg font-bold'>
                  Room Type<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {getRoomTypes(propertyDetails.propertyType).map((type) => (
                    <Button
                      key={type.value}
                      size='custom'
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.roomType === type.value
                          ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-gray-700 '
                      )}
                      onClick={() => handleButtonClick('roomType', type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sharing Type */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              propertyDetails.propertyType === 'PG' ||
              propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
              <div>
                <Label className='text-lg font-bold'>
                  Sharing Type<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-4 mt-2'>
                  {getShareTypes(propertyDetails.propertyType).map((type) => (
                    <Button
                      key={type.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.sharingType === type.value
                          ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-gray-700 '
                      )}
                      onClick={() =>
                        handleButtonClick('sharingType', type.value)
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY' && (
              <Select
                value={propertyDetails.preoccupiedPropertyType}
                onValueChange={(value) => {
                  handleSelectChange('preoccupiedPropertyType', value);
                }}
                required
              >
                <SelectTrigger className='w-full focus:outline-none focus:ring-0 ring-offset-transparent focus:border-none focus:ring-offset-0'>
                  <SelectValue placeholder='Select a preoccupied property type' />
                </SelectTrigger>
                <SelectContent>
                  {propertyOptions.map((option) => (
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
            )}

            {/* Configuration */}
            {(propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
              <div>
                <Label className='text-lg font-bold'>
                  Configuration<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-4 mt-2'>
                  {configuration.map((type) => (
                    <Button
                      key={type.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.configuration === type.value
                          ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-gray-700 '
                      )}
                      onClick={() =>
                        handleButtonClick('configuration', type.value)
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Number of Units Available */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              propertyDetails.propertyType === 'PG' ||
              propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
              <div className=''>
                <div className=''>
                  <CustomInput
                    type='number'
                    name='units'
                    label='Number Of Units Available'
                    id='units'
                    value={propertyDetails.units}
                    onChange={handleInputChange}
                    placeholder='Enter Number of Unts Available'
                  />
                </div>
              </div>
            )}

            {/* Rooms Size */}
            {(propertyDetails.propertyType === 'CO_LIVING' ||
              propertyDetails.propertyType === 'PG' ||
              propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
              <div className=''>
                <div className=''>
                  <CustomInput
                    type='number'
                    name='roomSize'
                    label='Room Size'
                    id='roomSize'
                    value={propertyDetails.roomSize}
                    onChange={handleInputChange}
                    placeholder='Enter Rooms Size'
                  />
                </div>
              </div>
            )}

            {(propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
              <div className='flex flex-wrap gap-6'>
                <div className='w-full lg:w-[48%]'>
                  <CustomInput
                    type='number'
                    name='bedroom'
                    id='bedroom'
                    label='Number Of Bedroom'
                    value={propertyDetails.bedroom}
                    onChange={handleInputChange}
                    placeholder='Number Of Bedroom'
                    required
                  />
                </div>
                <div className='w-full lg:w-[48%]'>
                  <CustomInput
                    type='number'
                    name='balcony'
                    id='balcony'
                    label='Number Of Balcony'
                    value={propertyDetails.balcony}
                    onChange={handleInputChange}
                    placeholder='Number Of Balcony'
                    required
                  />
                </div>
                <div className='w-full lg:w-[48%]'>
                  <CustomInput
                    type='number'
                    name='bathroom'
                    id='bathroom'
                    label='Number Of Bathroom'
                    value={propertyDetails.bathroom}
                    onChange={handleInputChange}
                    placeholder='Enter Number Of Bathroom'
                    required
                  />
                </div>
                <div className='w-full lg:w-[48%]'>
                  <CustomInput
                    type='number'
                    name='maintenanceChargesAmount'
                    id='maintenanceChargesAmount'
                    label='Maintenance Charge'
                    value={propertyDetails.maintenanceChargesAmount}
                    onChange={handleInputChange}
                    placeholder='Maintenance Charges (per month)*'
                    required
                  />
                </div>
              </div>
            )}

            {/* Furnishing Level */}
            <div>
              <Label className='text-lg font-bold'>
                Furnishing Level<span className='text-red-500'>*</span>
              </Label>
              <div className='flex flex-wrap gap-2 mt-2'>
                {furnishingLevels.map((level) => (
                  <Button
                    key={level.value}
                    className={cn(
                      'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                      propertyDetails.furnishingLevel === level.value
                        ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                        : 'bg-white text-gray-700 '
                    )}
                    onClick={() =>
                      handleButtonClick('furnishingLevel', level.value)
                    }
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Furnishings (as array) */}
            {(propertyDetails.furnishingLevel.includes('FULLY_FURNISHED') ||
              propertyDetails.furnishingLevel.includes('SEMI_FURNISHED')) && (
              <div>
                <Label className='text-lg font-bold'>Furnishings</Label>
                <div className='flex flex-wrap gap-4 mt-2'>
                  {getFurnishings(propertyDetails.propertyType).map(
                    (furnishing) => (
                      <Button
                        key={furnishing.value}
                        className={cn(
                          'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors',
                          propertyDetails.furnishings.includes(furnishing.value)
                            ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                            : 'bg-white text-gray-700 border-gray-300 '
                        )}
                        onClick={() => handleFurnishingClick(furnishing.value)}
                      >
                        <Image
                          src={furnishing.url}
                          alt={furnishing.label}
                          width={55}
                          height={55}
                          className={`object-contain ${
                            propertyDetails.furnishings.includes(
                              furnishing.value
                            )
                              ? 'brightness-0 invert'
                              : ''
                          }`}
                        />
                        <div className=' text-center text-wrap'>
                          {furnishing.label}
                        </div>
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <Label className='text-lg font-bold'>Amenities</Label>
              <div className='flex flex-wrap gap-4 mt-2'>
                {amenitiesList.map((amenity) => (
                  <Button
                    key={amenity.value}
                    className={cn(
                      'rounded-md border-2 w-32 h-32 flex flex-col items-center justify-center text-sm font-medium transition-colors',
                      propertyDetails.amenities.includes(amenity.value)
                        ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                        : 'bg-white text-gray-700 border-gray-300 '
                    )}
                    onClick={() => handleAmenityClick(amenity.value)}
                  >
                    <Image
                      src={amenity.url}
                      alt={amenity.label}
                      width={55}
                      height={55}
                      className={`object-contain ${
                        propertyDetails.amenities.includes(amenity.value)
                          ? 'brightness-0 invert'
                          : ''
                      }`}
                    />
                    <div className='mt-2 text-center text-wrap'>
                      {amenity.label}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <Label className='text-lg font-bold'>Features</Label>
              <div className='flex flex-wrap gap-6 mt-2'>
                {getFeature(propertyDetails.propertyType).map((feature) => (
                  <Button
                    key={feature.value}
                    className={cn(
                      'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                      propertyDetails.features.includes(feature.value)
                        ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                        : 'bg-white text-gray-700 '
                    )}
                    onClick={() => handleFeatureClick(feature.value)}
                  >
                    {feature.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className='flex flex-wrap gap-6'>
              {/* Monthly Rent */}
              <div className='w-full lg:w-[48%]'>
                <CustomInput
                  type='number'
                  name='monthlyRent'
                  id='monthlyRent'
                  label='Monthly Rent'
                  value={propertyDetails.monthlyRent}
                  onChange={handleInputChange}
                  placeholder='Enter Monthly Rent'
                  required
                />
              </div>

              {/* Security Deposit */}
              <div className='w-full lg:w-[48%]'>
                <CustomInput
                  type='number'
                  name='securityDepositamount'
                  id='securityDepositamount'
                  label='Security Deposit'
                  value={propertyDetails.securityDepositamount}
                  onChange={handleInputChange}
                  placeholder='Enter Security Deposit'
                  required
                />
              </div>

              {/* Lock In Period */}
              <div>
                <Label className='text-lg font-bold'>
                  Lock In Period<span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {lockInPeriod.map((level) => (
                    <Button
                      key={level.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.lockInPeriodMonths === level.value
                          ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-gray-700 '
                      )}
                      onClick={() =>
                        handleButtonClick('lockInPeriodMonths', level.value)
                      }
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>

              {(propertyDetails.propertyType === 'VILLA' ||
                propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
                <div className='w-full lg:w-[48%]'>
                  <CustomInput
                    label='Total Number Of Floors'
                    type='number'
                    name='totalfloor'
                    id='totalfloor'
                    placeholder='Enter Number Of Floors'
                    value={propertyDetails.totalfloor}
                    className='placeholder:text-slate-700  block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
            </div>

            {/* Brokerage */}
            <div className=''>
              <CustomInput
                type='number'
                name='brokerageAmount'
                label='Brokerage Amount'
                id='brokerageAmount'
                value={propertyDetails.brokerageAmount}
                onChange={handleInputChange}
                placeholder='Enter Brokerage (In Rupees)'
                required
              />
              <label className='inline-flex items-center mt-3 border px-4 py-2 rounded-md '>
                <Input
                  type='checkbox'
                  name='brokerageNegotiable'
                  checked={propertyDetails.brokerageNegotiable}
                  onChange={handleInputChange}
                  className='form-checkbox h-5 w-4 text-[#42A4AE] border-2 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                />
                <span className='ml-2 text-gray-700 text-sm'>
                  Brokerage Negotiable
                </span>
              </label>
            </div>

            {/* Preferred Tenant Type */}
            {(propertyDetails.propertyType === 'VILLA' ||
              propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
              <div>
                <Label className='text-lg font-bold'>
                  Preferred Tenant Type
                  <span className='text-red-500'>*</span>
                </Label>
                <div className='flex flex-wrap gap-6 mt-2'>
                  {getTenantType(propertyDetails.propertyType).map((tenant) => (
                    <Button
                      key={tenant.value}
                      className={cn(
                        'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                        propertyDetails.preferredTenantType.includes(
                          tenant.value
                        )
                          ? 'bg-[#42a4ae] text-white shadow-slate-500 border-none shadow-lg'
                          : 'bg-white text-gray-700 '
                      )}
                      onClick={() => handleTenantClick(tenant.value)}
                    >
                      {tenant.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Number */}
            {(propertyDetails.propertyType === 'BUILDER_FLOOR' ||
              propertyDetails.propertyType === 'FLAT_APARTMENT' ||
              propertyDetails.propertyType === 'PREOCCUPIED_PROPERTY') && (
              <div className=' flex justify-start items-center gap-6 w-full lg:w-[60%]'>
                <Label className='font-bold text-lg text-nowrap'>
                  Floor Number
                </Label>
                <Input
                  type='number'
                  name='floornumber'
                  id='floornumber'
                  value={propertyDetails.floornumber}
                  onChange={handleInputChange}
                  className='placeholder:text-slate-700  block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                  required
                />
                <Label className='font-bold text-lg text-nowrap  '>
                  Out Of
                </Label>
                <Input
                  type='number'
                  name='totalfloor'
                  id='totalfloor'
                  value={propertyDetails.totalfloor}
                  className='placeholder:text-slate-700  block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-4'>
        <Button
          onClick={handleBack}
          variant='outline'
          className='border-2 border-[#42A4AE] text-[#42A4AE]'
        >
          Cancel
        </Button>

        {!isFormValid ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='cursor-not-allowed'>
                <Button
                  onClick={handleSubmit}
                  className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
                  disabled={!isFormValid}
                >
                  Next, Add Address
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-[#42A4AE] text-white'>
                <p>Please fill out all required fields to proceed.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : page === 'edit' ? (
          <Button
            onClick={handleEdit}
            className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
            disabled={!isFormValid}
          >
            Edit And Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
            disabled={!isFormValid}
          >
            Next, Add Address
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyDetailsForm;
