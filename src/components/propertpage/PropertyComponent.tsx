'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useFilters } from '@/lib/context/FilterContext';

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PropertyComponent() {
  const { filters, updateFilters } = useFilters();

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

  const handleRentChange = useCallback(
    (value: number[]) => {
      if (value.length === 2) {
        updateFilters('rent', [value[0], value[1]]);
      }
    },
    [updateFilters]
  );

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
              onValueChange={handleRentChange}
            />
            <div className='flex justify-between text-sm'>
              <span>₹{filters.rent[0]}</span>
              <span>₹{filters.rent[1]}</span>
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
          {/* <div className='space-y-2'>
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
          </div> */}

          {/* Available For */}
          {/* <div className='space-y-2'>
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
          </div> */}

          {/* Furnishing */}
          {/* <div className='space-y-2'>
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
          </div> */}

          {/* Amenities */}
          {/* <div className='space-y-2'>
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
          </div> */}

          {/* Parking */}
          {/* <div className='space-y-2'>
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
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
