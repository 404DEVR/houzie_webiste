'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { useFilters } from '@/lib/context/FilterContext';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PropertyComponent() {
  const { filters, updateFilters } = useFilters();

  const [sliderValue, setSliderValue] = useState(filters.rent);

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

  const amenities = [
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

  return (
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
            <Slider
              defaultValue={filters.rent}
              max={50000}
              step={1000}
              onValueChange={(value: any) => {
                setSliderValue(value);
                updateFilters('rent', value);
              }}
            />
            <div className='flex justify-between text-sm'>
              <span>₹{sliderValue[0]}</span>
              <span>₹{sliderValue[1]}</span>
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Property Type</h4>
            {propertyTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2'>
                <Checkbox
                  checked={filters.propertyType.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters('propertyType', [
                        ...filters.propertyType,
                        type,
                      ]);
                    } else {
                      updateFilters(
                        'propertyType',
                        filters.propertyType.filter((t) => t !== type)
                      );
                    }
                  }}
                />
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>BHK Type</h4>
            {bhkTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2'>
                <Checkbox
                  checked={filters.bhkType.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters('bhkType', [...filters.bhkType, type]);
                    } else {
                      updateFilters(
                        'bhkType',
                        filters.bhkType.filter((t) => t !== type)
                      );
                    }
                  }}
                />
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Available For</h4>
            {availableForTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2'>
                <Checkbox
                  checked={filters.availableFor.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters('availableFor', [
                        ...filters.availableFor,
                        type,
                      ]);
                    } else {
                      updateFilters(
                        'availableFor',
                        filters.availableFor.filter((t) => t !== type)
                      );
                    }
                  }}
                />
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Furnishing</h4>
            {furnishingTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2'>
                <Checkbox
                  checked={filters.furnishing.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters('furnishing', [
                        ...filters.furnishing,
                        type,
                      ]);
                    } else {
                      updateFilters(
                        'furnishing',
                        filters.furnishing.filter((t) => t !== type)
                      );
                    }
                  }}
                />
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Amenities</h4>
            {amenities.map((type) => (
              <div key={type} className='flex items-center space-x-2'>
                <Checkbox
                  checked={filters.amenities.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters('amenities', [...filters.amenities, type]);
                    } else {
                      updateFilters(
                        'amenities',
                        filters.amenities.filter((t) => t !== type)
                      );
                    }
                  }}
                />
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Parking</h4>
            {parkingTypes.map((type) => (
              <div key={type} className='flex items-center space-x-2'>
                <Checkbox
                  checked={filters.parking.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters('parking', [...filters.parking, type]);
                    } else {
                      updateFilters(
                        'parking',
                        filters.parking.filter((t) => t !== type)
                      );
                    }
                  }}
                />
                <label className='text-sm'>{toTitleCase(type)}</label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
