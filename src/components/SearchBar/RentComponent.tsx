'use client';

import { ChevronDown } from 'lucide-react';
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

const RentComponent = () => {
  const dispatch = useDispatch();
  const minRent = useSelector((state: RootState) => state.search.minRent);
  const maxRent = useSelector((state: RootState) => state.search.maxRent);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderRect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - sliderRect.left) / sliderRect.width) * 10000;
    const value = Math.min(Math.max(0, Math.round(position)), 10000);

    if (isDragging === 'min') {
      if (value <= maxRent) {
        dispatch(setRentRange({ minRent: value, maxRent }));
      }
    } else if (isDragging === 'max') {
      if (value >= minRent) {
        dispatch(setRentRange({ minRent, maxRent: value }));
      }
    }
  };

  const getLeftPosition = (value: number) => {
    return `${(value / 10000) * 100}%`;
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    dispatch(setRentRange({ minRent, maxRent }));
    setIsOpen(false);
  };

  return (
    <div className='w-full'>
      <label className='text-sm font-semibold block text-gray-800'>Rent</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className='w-full rounded-md text-gray-700 text-sm bg-white focus:ring focus:ring-teal-300 cursor-pointer flex items-center justify-between py-2'>
            ₹ {minRent} - ₹ {maxRent}
            <ChevronDown className='h-4 w-4 text-gray-500' />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold mb-2'>Rent Range</h3>
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
                    left: getLeftPosition(minRent),
                    right: `${100 - (maxRent / 10000) * 100}%`,
                  }}
                />
                <button
                  className='absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                  style={{ left: getLeftPosition(minRent) }}
                  onMouseDown={() => setIsDragging('min')}
                />
                <button
                  className='absolute w-6 h-6 bg-white border-2 border-teal-500 rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                  style={{ left: getLeftPosition(maxRent) }}
                  onMouseDown={() => setIsDragging('max')}
                />
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <Input
                type='number'
                value={minRent}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= maxRent) {
                    dispatch(setRentRange({ minRent: value, maxRent }));
                  }
                }}
                className='w-1/2'
                placeholder='Min Rent'
              />
              <Input
                type='number'
                value={maxRent}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= minRent) {
                    dispatch(setRentRange({ minRent, maxRent: value }));
                  }
                }}
                className='w-1/2'
                placeholder='Max Rent'
              />
            </div>
            <Button
              onClick={handleApply}
              className='w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md'
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
