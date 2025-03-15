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
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold mb-2'>Rent Range</h3>
            <div className='relative w-[90%] mx-auto h-12'>
              <div
                className='absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2'
                onMouseMove={handleSliderChange}
                onMouseUp={() => setIsDragging(null)}
                onMouseLeave={() => setIsDragging(null)}
              >
                <div
                  className='absolute h-2 bg-[#3675ff] rounded-full'
                  style={{
                    left: getLeftPosition(minRent),
                    right: `${100 - (maxRent / MAX_RENT) * 100}%`,
                  }}
                />
                <button
                  className='absolute w-6 h-6 bg-white border-2 border-[#3675ff] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                  style={{ left: getLeftPosition(minRent) }}
                  onMouseDown={() => setIsDragging('min')}
                />
                <button
                  className='absolute w-6 h-6 bg-white border-2 border-[#3675ff] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                  style={{ left: getLeftPosition(maxRent) }}
                  onMouseDown={() => setIsDragging('max')}
                />
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <Input
                type='number'
                value={minRent}
                min={0}
                max={MAX_RENT}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= maxRent) {
                    dispatch(setRentRange({ minRent: value, maxRent }));
                  }
                }}
                className='w-1/2'
                placeholder='Min Rent'
              />
              <Input
                type='number'
                value={maxRent}
                min={0}
                max={MAX_RENT}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= minRent && value <= MAX_RENT) {
                    dispatch(setRentRange({ minRent, maxRent: value }));
                  }
                }}
                className='w-1/2'
                placeholder='Max Rent'
              />
            </div>
            <Button
              onClick={handleApply}
              className='w-full sm:w-auto bg-[#3675ff] hover:bg-[#729eff] text-white px-4 py-2 rounded-md'
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
