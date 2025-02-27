'use client';

import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ConfigType, PropertyType, SharingType } from '@/interfaces/Interface';
import {
  clearSearch,
  setConfiguration,
  setLivingType,
  setPropertyType,
} from '@/redux/slices/searchSlice';
import { RootState } from '@/redux/store';

const PropertyComponentSearchbar = () => {
  const dispatch = useDispatch();
  const propertyType = useSelector(
    (state: RootState) => state.search.propertyType
  );
  const configuration = useSelector(
    (state: RootState) => state.search.configuration
  );
  const livingType = useSelector((state: RootState) => state.search.livingType);

  const propertyTypes: PropertyType[] = [
    {
      id: 'builderFloor',
      label: 'Builder Floor',
      description:
        'Independent floors in a low-rise building, offering privacy and exclusivity.',
    },
    {
      id: 'villa',
      label: 'Villa',
      description:
        'Luxurious, detached homes with private gardens and premium amenities.',
    },
    {
      id: 'coliving',
      label: 'Coliving',
      description:
        'Shared living spaces designed for community and convenience, ideal for students and young professionals.',
    },
    {
      id: 'pg',
      label: 'PG',
      description:
        'Affordable shared accommodation, typically including meals and basic amenities.',
    },
    {
      id: 'flatApartment',
      label: 'Flat Apartment',
      description: 'Standard residential units within a multi-story building.',
    },
    {
      id: 'preoccupiedApartment',
      label: 'Preoccupied Apartment',
      description:
        'Apartments currently occupied by tenants, often available for investment.',
    },
  ];

  const configurations: ConfigType[] = [
    { id: '1bhk', label: '1 BHK' },
    { id: '2bhk', label: '2 BHK' },
    { id: '3bhk', label: '3 BHK' },
    { id: '4bhk', label: '4 BHK' },
    { id: '4+bhk', label: '4+ BHK' },
    { id: 'studio', label: 'Studio/1 RK' },
  ];

  const SharingTypes: SharingType[] = [
    { id: 'SINGLE', label: 'Single' },
    { id: 'SHARING', label: 'Sharing' },
  ];

  const handleCheckboxChange = (
    category: 'propertyType' | 'configuration' | 'livingType',
    id: string
  ) => {
    switch (category) {
      case 'propertyType': {
        const newPropertyType = propertyType.includes(id)
          ? propertyType.filter((item) => item !== id)
          : [...propertyType, id];
        dispatch(setPropertyType(newPropertyType));
        break;
      }
      case 'configuration': {
        const newConfiguration = configuration.includes(id)
          ? configuration.filter((item) => item !== id)
          : [...configuration, id];
        dispatch(setConfiguration(newConfiguration));
        break;
      }
      case 'livingType': {
        const newLivingType = livingType.includes(id)
          ? livingType.filter((item) => item !== id)
          : [...livingType, id];
        dispatch(setLivingType(newLivingType));
        break;
      }
      default:
        break;
    }
  };

  const getDisplayText = (): string => {
    const selections: string[] = [];
    if (propertyType.length)
      selections.push(`${propertyType.length} Properties`);
    if (configuration.length)
      selections.push(`${configuration.length} Configs`);
    if (livingType.length) selections.push(`${livingType.length} Types`);
    return selections.length ? selections.join(', ') : 'Choose property type';
  };

  const CheckboxGroup = ({
    title,
    options,
    category,
  }: {
    title: string;
    options: ConfigType[] | SharingType[];
    category: 'configuration' | 'livingType';
  }) => (
    <div className='w-full'>
      <label className='text-sm font-semibold mb-3 block text-gray-800'>
        {title}
      </label>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
        {options.map((option) => (
          <label
            key={option.id}
            className='flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-transparent hover:border-teal-500 hover:bg-teal-50 focus-within:ring-2 focus-within:ring-teal-500 transition-all duration-200 ease-in-out'
          >
            <input
              type='checkbox'
              checked={
                category === 'configuration'
                  ? configuration.includes(option.id)
                  : livingType.includes(option.id)
              }
              onChange={() => handleCheckboxChange(category, option.id)}
              className='w-5 h-5 rounded-md text-teal-500 focus:ring-teal-500 border-gray-300 transition-colors duration-200 ease-in-out'
            />
            <span className='text-sm text-gray-700 font-medium'>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const CheckBoxPropertyType = ({
    title,
    options,
    category,
  }: {
    title: string;
    options: PropertyType[];
    category: 'propertyType';
  }) => (
    <div className='w-full'>
      <div className='flex flex-col items-center justify-between w-full'>
        {options.map((option) => (
          <div key={option.id} className='border-b-gray-300 border-b-2 w-full'>
            <label className='flex flex-col items-start space-x-2 cursor-pointer p-3 hover:bg-teal-100 rounded-2xl m-2'>
              <span className='flex flex-row items-center text-black text-base sm:text-lg font-poppins font-medium leading-5 tracking-tighter w-full'>
                <input
                  type='checkbox'
                  checked={propertyType.includes(option.id)}
                  onChange={() => handleCheckboxChange(category, option.id)}
                  className='w-5 h-5 sm:w-6 sm:h-6 rounded-full border-gray-300 text-black focus:ring-black'
                />
                <div className='ml-2 text-xl'>{option.label}</div>
              </span>
              <div className='flex flex-col justify-around py-2 px-4 space-y-2 rounded-md w-full'>
                <p className='text-gray-500 font-poppins text-xs font-normal leading-4 tracking-tighter'>
                  {option.description}
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const showConfigurations = propertyType.some(
    (type) => type === 'builderFloor' || type === 'flatApartment'
  );

  const showLivingTypes = propertyType.some(
    (type) => type === 'coliving' || type === 'pg'
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleClearAll = () => {
    dispatch(clearSearch());
    setIsOpen(false);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  return (
    <div className='w-full '>
      <label className='text-sm font-semibold block text-gray-800'>
        Property Type
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className='w-full rounded-md text-gray-700 text-sm bg-white focus:ring focus:ring-teal-300 cursor-pointer flex items-center justify-between py-2'>
            <span>{getDisplayText()}</span>
            <ChevronDown className='h-4 w-4 text-gray-500' />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-[90%] lg:w-[80vh] max-h-[80vh] overflow-y-auto'>
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-800'>
              Property Details
            </h3>

            <CheckBoxPropertyType
              title='Property Type'
              options={propertyTypes}
              category='propertyType'
            />

            {showConfigurations && (
              <CheckboxGroup
                title='Configuration'
                options={configurations}
                category='configuration'
              />
            )}

            {showLivingTypes && (
              <CheckboxGroup
                title='Sharing Type'
                options={SharingTypes}
                category='livingType'
              />
            )}

            <div className='flex flex-col sm:flex-row justify-end gap-2'>
              <Button
                className='w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md'
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              <Button
                className='w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md'
                onClick={handleApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PropertyComponentSearchbar;
