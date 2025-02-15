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

export default function PropertyComponent() {
  const { filters, updateFilters } = useFilters();

  const [sliderValue, setSliderValue] = useState(filters.rent);
  // const resetFilters = () => {
  //   updateFilters('reset', {
  //     rent: [0, 50000],
  //     propertyType: [],
  //     bhkType: [],
  //     availableFor: [],
  //     furnishing: [],
  //     amenities: [],
  //     parking: [],
  //   });
  // };
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
          {/* Property Type */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Property Type</h4>
            {[
              'House',
              'Builder floor',
              'Villa',
              'Co living/PG',
              'Preoccupied property',
              'Flat/apartment',
            ].map((type) => (
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
                <label className='text-sm'>{type}</label>
              </div>
            ))}
          </div>
          {/* BHK Type */}
          <div className='space-y-2'>
            <h4 className='font-medium'>BHK Type</h4>
            {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map((type) => (
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
                <label className='text-sm'>{type}</label>
              </div>
            ))}
          </div>
          {/* Available For */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Available For</h4>
            {['All', 'Family', 'Bachelor'].map((type) => (
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
                <label className='text-sm'>{type}</label>
              </div>
            ))}
          </div>
          {/* Furnishing */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Furnishing</h4>
            {['Full Furnish', 'Semi Furnish', 'No Furnish'].map((type) => (
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
                <label className='text-sm'>{type}</label>
              </div>
            ))}
          </div>
          {/* Amenities */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Amenities</h4>
            {[
              'Owner Free',
              'Pet Friendly',
              'Couple Friendly',
              'Balcony',
              'Wifi',
              'Grocery Shop',
              'Gym',
              'Car Parking',
              '24/7 Water Supply',
              '24/7 Security',
              'Club House',
              'High Speed Elevators',
            ].map((type) => (
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
                <label className='text-sm'>{type}</label>
              </div>
            ))}
          </div>
          {/* Parking */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Parking</h4>
            {['2 Wheeler', '4 Wheeler'].map((type) => (
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
                <label className='text-sm'>{type}</label>
              </div>
            ))}
          </div>
          {/* <div className='pt-4 flex justify-end gap-2'>
            <Button variant='outline' onClick={() => resetFilters}>
              Clear All
            </Button>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
