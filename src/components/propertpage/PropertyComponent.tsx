'use client';

import { SlidersHorizontal } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { useFilters } from '@/lib/context/FilterContext';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PropertyComponent() {
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

  return (
    <>
      <div className='hidden md:block'>
        <div className='space-y-4'>
          {/* Rent Range */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Rent</h4>
            <div className='relative w-[90%] mx-auto h-12'>
              <div
                className='absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2'
                onMouseMove={(e) => isDragging && handleSliderChange(e)}
                onMouseUp={() => setIsDragging(null)}
                onMouseLeave={() => setIsDragging(null)}
              >
                <div
                  className='absolute h-2 bg-teal-500 rounded-full'
                  style={{
                    left: getLeftPosition(tempRent[0]),
                    right: `${100 - (tempRent[1] / 50000) * 100}%`,
                  }}
                />
                <button
                  className='absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                  style={{ left: getLeftPosition(tempRent[0]) }}
                  onMouseDown={() => setIsDragging('min')}
                />
                <button
                  className='absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                  style={{ left: getLeftPosition(tempRent[1]) }}
                  onMouseDown={() => setIsDragging('max')}
                />
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <Input
                type='number'
                value={tempRent[0]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setTempRent([value, tempRent[1]]);
                }}
                className='w-1/2'
                placeholder='Min Rent'
              />
              <Input
                type='number'
                value={tempRent[1]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setTempRent([tempRent[0], value]);
                }}
                className='w-1/2'
                placeholder='Max Rent'
              />
              <Button
                type='button'
                variant='outline'
                className='flex justify-center items-center text-white bg-[#42A4AE]'
                onClick={handleApplyRent}
              >
                Apply
              </Button>
            </div>
          </div>
          {/* Property Type */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Property Type</h4>
            {propertyTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2'>
                <Checkbox
                  checked={filters.propertyType.includes(type)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('propertyType', type, checked)
                  }
                />
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>
          {/* BHK Type */}
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
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>
          {/* Available For */}
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
          {/* Furnishing */}
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
          {/* Amenities */}
          <div className='space-y-2'>
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
          {/* Parking */}
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
        </div>
      </div>
      <div className='block md:hidden'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='flex gap-2'>
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 p-4' side='bottom'>
            <div className='space-y-4 max-h-[80vh] overflow-y-auto'>
              {/* Rent Range */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Rent</h4>
                <div className='relative w-[90%] mx-auto h-12'>
                  <div
                    className='absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2'
                    onMouseMove={(e) => isDragging && handleSliderChange(e)}
                    onMouseUp={() => setIsDragging(null)}
                    onMouseLeave={() => setIsDragging(null)}
                  >
                    <div
                      className='absolute h-2 bg-teal-500 rounded-full'
                      style={{
                        left: getLeftPosition(tempRent[0]),
                        right: `${100 - (tempRent[1] / 50000) * 100}%`,
                      }}
                    />
                    <button
                      className='absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                      style={{ left: getLeftPosition(tempRent[0]) }}
                      onMouseDown={() => setIsDragging('min')}
                    />
                    <button
                      className='absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                      style={{ left: getLeftPosition(tempRent[1]) }}
                      onMouseDown={() => setIsDragging('max')}
                    />
                  </div>
                </div>
                <div className='flex justify-between gap-4'>
                  <Input
                    type='number'
                    value={tempRent[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setTempRent([value, tempRent[1]]);
                    }}
                    className='w-1/2'
                    placeholder='Min Rent'
                  />
                  <Input
                    type='number'
                    value={tempRent[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setTempRent([tempRent[0], value]);
                    }}
                    className='w-1/2'
                    placeholder='Max Rent'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    className='flex justify-center items-center text-white bg-[#42A4AE]'
                    onClick={handleApplyRent}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              {/* Property Type */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Property Type</h4>
                {propertyTypes.map((type) => (
                  <div key={type} className='flex items-center space-x-2'>
                    <Checkbox
                      checked={filters.propertyType.includes(type)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('propertyType', type, checked)
                      }
                    />
                    <label className='text-sm'>{toTitleCase(type)}</label>
                  </div>
                ))}
              </div>
              {/* BHK Type */}
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
                    <label className='text-sm'>{toTitleCase(type)}</label>
                  </div>
                ))}
              </div>

              {/* Available For */}
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

              {/* Furnishing */}
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
              {/* Amenities */}
              <div className='space-y-2'>
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

              {/* Parking */}
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
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
