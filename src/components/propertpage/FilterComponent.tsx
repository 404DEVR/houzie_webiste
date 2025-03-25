import { Minus } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { useFilters } from '@/lib/context/FilterContext';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { PropertyComponentProps } from '@/interfaces/PropsInterface';

// Function to convert string to title case
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to convert BHK type to numeric value
function bhkToNumeric(bhkType: string): string {
  switch (bhkType) {
    case 'ONE_RK':
      return '1 RK';
    case 'ONE_BHK':
      return '1 BHK';
    case 'TWO_BHK':
      return '2 BHK';
    case 'THREE_BHK':
      return '3 BHK';
    case 'FOUR_BHK':
      return '4 BHK';
    case 'FOUR_PLUS_BHK':
      return '4+ BHK';
    default:
      return 'Unknown';
  }
}

export default function FilterComponent({ setOpen }: PropertyComponentProps) {
  const { filters, updateFilters } = useFilters();
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [tempRent, setTempRent] = useState<[number, number]>([...filters.rent]);

  const propertyTypes = [
    'BUILDER_FLOOR',
    'VILLA',
    'CO_LIVING',
    'PG',
    'PREOCCUPIED_PROPERTY',
    'FLAT_APARTMENT',
  ];

  const bhkTypes = [
    'ONE_RK',
    'ONE_BHK',
    'TWO_BHK',
    'THREE_BHK',
    'FOUR_BHK',
    'FOUR_PLUS_BHK',
  ];

  const availableForTypes = ['FAMILY', 'BACHELOR', 'COMPANY_LEASE', 'ANY'];
  const furnishingTypes = ['FULLY_FURNISHED', 'SEMI_FURNISHED', 'NONE'];
  const allAmenities = [
    'WIFI',
    'POWER_BACKUP',
    'FOUR_WHEELER_PARKING',
    'TWO_WHEELER_PARKING',
    'WATER_SUPPLY_24_7',
    'SECURITY_24_7',
    'DAILY_HOUSEKEEPING',
    'CCTV',
    'MEALS',
    'COUPLE_FRIENDLY',
    'PET_FRIENDLY',
    'OWNER_FREE',
    'BALCONY',
    'ATTACHED_BATHROOM',
    'GATED_COMMUNITY',
  ];
  const parkingTypes = ['TWO_WHEELER_PARKING', 'FOUR_WHEELER_PARKING'];
  const Features = ['COUPLE_FRIENDLY', 'OWNER_FREE', 'PET_FRIENDLY'];
  const Gender = ['MALE', 'FEMALE', 'OTHER'];
  const SharingType = ['SINGLE', 'SHARED'];

  const [isBHKOpen, setIsBHKOpen] = useState(false);
  const [isAvailableForOpen, setIsAvailableForOpen] = useState(false);
  const [isFurnishingOpen, setIsFurnishingOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isParkingOpen, setIsParkingOpen] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    bhkType: [...filters.bhkType],
    availableFor: [...filters.availableFor],
    furnishing: [...filters.furnishing],
    amenities: [...filters.amenities],
    parking: [...filters.parking],
    gender: [...filters.gender],
    SharingType: [...filters.sharingType],
    features: [...filters.features],
  });

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderRect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - sliderRect.left) / sliderRect.width) * 50000;
    const value = Math.min(Math.max(0, Math.round(position)), 50000);

    if (isDragging === 'min') {
      setTempRent([value, tempRent[1]]);
    } else if (isDragging === 'max') {
      setTempRent([tempRent[0], value]);
    }
  };

  const getLeftPosition = (value: number) => {
    return `${(value / 50000) * 100}%`;
  };

  const handleCheckboxChange = useCallback(
    (
      key: 'bhkType' | 'availableFor' | 'furnishing' | 'amenities' | 'parking',
      value: string,
      checked: boolean | string
    ) => {
      const currentValue = localFilters[key];
      let newValue: string[];

      if (checked) {
        newValue = [...currentValue, value];
      } else {
        newValue = currentValue.filter((item) => item !== value);
      }

      setLocalFilters((prevFilters) => ({ ...prevFilters, [key]: newValue }));
    },
    [localFilters, setLocalFilters]
  );

  const handleApplyRent = () => {
    updateFilters('rent', [tempRent[0], tempRent[1]]);
    updateFilters('bhkType', localFilters.bhkType);
    updateFilters('availableFor', localFilters.availableFor);
    updateFilters('furnishing', localFilters.furnishing);
    updateFilters('amenities', localFilters.amenities);
    updateFilters('parking', localFilters.parking);
  };

  const handleDropdownToggle = (dropdown: string) => {
    switch (dropdown) {
      case 'bhkType':
        setIsBHKOpen(!isBHKOpen);
        setIsAvailableForOpen(false);
        setIsFurnishingOpen(false);
        setIsAmenitiesOpen(false);
        setIsParkingOpen(false);
        break;
      case 'availableFor':
        setIsAvailableForOpen(!isAvailableForOpen);
        setIsBHKOpen(false);
        setIsFurnishingOpen(false);
        setIsAmenitiesOpen(false);
        setIsParkingOpen(false);
        break;
      case 'furnishing':
        setIsFurnishingOpen(!isFurnishingOpen);
        setIsBHKOpen(false);
        setIsAvailableForOpen(false);
        setIsAmenitiesOpen(false);
        setIsParkingOpen(false);
        break;
      case 'amenities':
        setIsAmenitiesOpen(!isAmenitiesOpen);
        setIsBHKOpen(false);
        setIsAvailableForOpen(false);
        setIsFurnishingOpen(false);
        setIsParkingOpen(false);
        break;
      case 'parking':
        setIsParkingOpen(!isParkingOpen);
        setIsBHKOpen(false);
        setIsAvailableForOpen(false);
        setIsFurnishingOpen(false);
        setIsAmenitiesOpen(false);
        break;
      default:
        break;
    }
  };

  const handleClearAll = () => {
    updateFilters('bhkType', []);
    updateFilters('availableFor', []);
    updateFilters('furnishing', []);
    updateFilters('amenities', []);
    updateFilters('parking', []);
    if (setOpen) {
      setOpen(false);
    }
  };
  return (
    <div className=''>
      <div className='space-y-2'>
        <h1 className='text-xl font-semibold'>Filters</h1>
        <div className='space-y-2 max-h-[400px] overflow-y-auto '>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Configuration</h1>
              <Minus />
            </div>
            {bhkTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.bhkType.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('bhkType', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {bhkToNumeric(type)}
                </label>
              </div>
            ))}
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Available For</h1>
              <Minus />
            </div>
            {availableForTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.availableFor.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('availableFor', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {toTitleCase(type)}
                </label>
              </div>
            ))}
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Furnishings</h1>
              <Minus />
            </div>
            {furnishingTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.furnishing.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('furnishing', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {type === 'NONE' ? 'Unfurnished' : toTitleCase(type)}
                </label>
              </div>
            ))}
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Features</h1>
              <Minus />
            </div>
            {Features.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.furnishing.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('furnishing', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {toTitleCase(type)}
                </label>
              </div>
            ))}
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Sharing Type</h1>
              <Minus />
            </div>
            {SharingType.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.furnishing.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('furnishing', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {toTitleCase(type)}
                </label>
              </div>
            ))}
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Gender</h1>
              <Minus />
            </div>
            {Gender.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.furnishing.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('furnishing', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {toTitleCase(type)}
                </label>
              </div>
            ))}
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Amenities</h1>
              <Minus />
            </div>
            {allAmenities.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.amenities.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('amenities', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {toTitleCase(type)}
                </label>
              </div>
            ))}
          </div>
          {/* <div>
            <div className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Parking</h1>
              <Minus />
            </div>
            {parkingTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  checked={localFilters.parking.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('parking', type, checked)
                  }
                  className='border border-[#646464]'
                />
                <label className='text-sm text-[#646464]'>
                  {toTitleCase(type)}
                </label>
              </div>
            ))}
          </div> */}
        </div>
        <div className='flex justify-between gap-2 mt-4'>
          <Button
            variant='outline'
            size='custom'
            className='bg-[#eeeefa] text-[#f66659] hover:bg-[#f66659] hover:text-[#f5f5fa] px-4 font-normal py-2 rounded-md border-none'
            onClick={handleClearAll}
          >
            Clear All
          </Button>
          <Button
            variant='outline'
            size='custom'
            className='bg-[#eeeefa] text-[#3b8ff6] hover:bg-[#3b8ff6] hover:text-white px-4 font-normal py-2 rounded-md border-none'
            onClick={handleApplyRent}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
