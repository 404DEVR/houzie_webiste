'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { setRentRange } from '@/redux/slices/searchSlice';
import { RootState } from '@/redux/store';
import { useFilters } from '@/lib/context/FilterContext';
import { ChevronDown } from 'lucide-react';
import CustomInput from '@/components/inputs/CustomInput';
import { cn } from '@/lib/utils';

const MAX_RENT = 500000;

const RentComponent = () => {
  const dispatch = useDispatch();
  const { updateFilters, filters } = useFilters();
  const minRent = useSelector((state: RootState) => state.search.minRent);
  const maxRent = useSelector((state: RootState) => state.search.maxRent);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const sliderRect = e.currentTarget.getBoundingClientRect();
    const position =
      ((e.clientX - sliderRect.left) / sliderRect.width) * MAX_RENT;
    const value = Math.min(Math.max(0, Math.round(position)), MAX_RENT);

    if (isDragging === 'min' && value <= maxRent) {
      dispatch(setRentRange({ minRent: value, maxRent }));
    } else if (isDragging === 'max' && value >= minRent) {
      dispatch(setRentRange({ minRent, maxRent: value }));
    }
  };

  const getLeftPosition = (value: number) => {
    return `${(value / MAX_RENT) * 100}%`;
  };

  const handleApply = () => {
    dispatch(setRentRange({ minRent, maxRent }));
    updateFilters('rent', [minRent, maxRent]);
    setIsOpen(false);
  };

  const formatPrice = (price) => {
    if (price >= 1_00_00_000) {
      return `${(price / 1_00_00_000).toFixed(1)} Cr`;
    } else if (price >= 1_00_000) {
      return `${(price / 1_00_000).toFixed(1)} L`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`;
    }
    return price.toString();
  };

  return (
    <div className='w-full'>
      <label className='text-xl font-medium block text-gray-800 leading-normal'>
        Rent
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className='w-full text-md rounded-md text-gray-700 px-4 py-4 text-sm bg-[#e0e0e0] focus:ring focus:ring-teal-300 cursor-pointer flex items-center justify-between'>
            {filters.rent
              ? `Rent: ₹${formatPrice(minRent)} - ₹${formatPrice(maxRent)}`
              : `Select Range of Rent`}
            <ChevronDown />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='space-y-2'>
            <h4 className='font-medium'>Rent</h4>
            <div className='flex flex-col gap-0 '>
              <div className='relative w-[90%] mx-auto h-8'>
                <div
                  className='absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2'
                  onMouseMove={(e) => isDragging && handleSliderChange(e)}
                  onMouseUp={() => setIsDragging(null)}
                  onMouseLeave={() => setIsDragging(null)}
                >
                  <div
                    className='absolute h-2 bg-[#3b8ff6] rounded-full'
                    style={{
                      left: getLeftPosition(minRent),
                      right: `${100 - (maxRent / 500000) * 100}%`,
                    }}
                  />
                  <button
                    className='absolute w-4 h-4 border-white border-2 bg-[#3b8ff6] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                    style={{ left: getLeftPosition(minRent) }}
                    onMouseDown={() => setIsDragging('min')}
                  />
                  <button
                    className='absolute w-4 h-4 border-white border-2 bg-[#3b8ff6] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                    style={{ left: getLeftPosition(maxRent) }}
                    onMouseDown={() => setIsDragging('max')}
                  />
                </div>
              </div>
              <p className='text-gray-500 text-xs pl-2'>Rent Range</p>
            </div>
            <div className='flex justify-between gap-2'>
              <CustomInput
                name='rent0'
                type='number'
                firstUnit='₹'
                value={minRent}
                onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                min={0}
                max={MAX_RENT}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= maxRent) {
                    dispatch(setRentRange({ minRent: value, maxRent }));
                  }
                }}
                className={cn(
                  'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                )}
                required
              />
              <CustomInput
                name='rent1'
                type='number'
                firstUnit='₹'
                value={maxRent}
                onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                min={0}
                max={MAX_RENT}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= minRent && value <= MAX_RENT) {
                    dispatch(setRentRange({ minRent, maxRent: value }));
                  }
                }}
                className={cn(
                  'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                )}
                required
              />
            </div>
            <Button
              type='button'
              size='custom'
              variant='outline'
              className='flex justify-center items-center w-full py-2 text-white bg-[#3b8ff6]'
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RentComponent;
