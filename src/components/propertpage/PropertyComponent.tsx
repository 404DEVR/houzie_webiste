'use client';

import React, { useCallback, useState } from 'react';

import { useFilters } from '@/lib/context/FilterContext';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export default function PropertyComponent() {
  const { filters, updateFilters } = useFilters();
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [tempRent, setTempRent] = useState<[number, number]>([...filters.rent]);
  const [selectedFilter, setSelectedFilter] = useState('bhkType');

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
      key:
        | 'propertyType'
        | 'bhkType'
        | 'availableFor'
        | 'furnishing'
        | 'amenities'
        | 'parking',
      value: string,
      checked: boolean | string
    ) => {
      const currentValue = filters[key] || [];
      let newValue: string[];

      if (checked) {
        newValue = [...currentValue, value];
      } else {
        newValue = currentValue.filter((item) => item !== value);
      }
      updateFilters(key, newValue);
    },
    [filters, updateFilters]
  );

  const handleApplyRent = () => {
    updateFilters('rent', [tempRent[0], tempRent[1]]);
  };

  const handleSelectChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <>
      <div className=''>
        <div className='space-y-4'>
          {/* Filter Select */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Select Filter</h4>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className='h-8 p-4 border-none focus:ring-0 bg-[#eff5ff] focus:outline-none focus-visible:border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'>
                <SelectValue
                  placeholder='Select Filter'
                  className='focus:ring-0 border-none bg-[#eff5ff] focus:outline-none focus-visible:border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='bhkType'>BHK Type</SelectItem>
                <SelectItem value='availableFor'>Available For</SelectItem>
                <SelectItem value='furnishing'>Furnishing</SelectItem>
                <SelectItem value='amenities'>Amenities</SelectItem>
                <SelectItem value='parking'>Parking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedFilter === 'bhkType' && (
            <div className='space-y-2'>
              <h4 className='font-medium'>BHK Type</h4>
              {bhkTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.bhkType.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('bhkType', type, checked)
                    }
                  />
                  {/* Display numeric value for BHK */}
                  <label className='text-sm'>{bhkToNumeric(type)}</label>
                </div>
              ))}
            </div>
          )}

          {selectedFilter === 'availableFor' && (
            <div className='space-y-2'>
              <h4 className='font-medium'>Available For</h4>
              {availableForTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.availableFor.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('availableFor', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </div>
          )}

          {selectedFilter === 'furnishing' && (
            <div className='space-y-2'>
              <h4 className='font-medium'>Furnishing</h4>
              {furnishingTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.furnishing.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('furnishing', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </div>
          )}

          {selectedFilter === 'amenities' && (
            <div className='space-y-2 max-h-[300px] overflow-y-auto'>
              <h4 className='font-medium'>Amenities</h4>
              {allAmenities.map((type) => (
                <div key={type} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.amenities.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('amenities', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </div>
          )}

          {selectedFilter === 'parking' && (
            <div className='space-y-2'>
              <h4 className='font-medium'>Parking</h4>
              {parkingTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.parking.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('parking', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
