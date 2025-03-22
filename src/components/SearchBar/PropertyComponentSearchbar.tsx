'use client';

import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { RiHomeOfficeFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import { useFilters } from '@/lib/context/FilterContext';

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
  const { updateFilters } = useFilters();
  const propertyType = useSelector(
    (state: RootState) => state.search.propertyType
  );
  const configuration = useSelector(
    (state: RootState) => state.search.configuration
  );
  const livingType = useSelector((state: RootState) => state.search.livingType);

  const propertyTypes: PropertyType[] = [
    {
      id: 'BUILDER_FLOOR',
      label: 'Builder Floor',
      description:
        'Independent floors in a low-rise building, offering privacy and exclusivity.',
    },
    {
      id: 'VILLA',
      label: 'Villa',
      description:
        'Luxurious, detached homes with private gardens and premium amenities.',
    },
    {
      id: 'CO_LIVING',
      label: 'Coliving',
      description:
        'Shared living spaces designed for community and convenience, ideal for students and young professionals.',
    },
    {
      id: 'PG',
      label: 'PG',
      description:
        'Affordable shared accommodation, typically including meals and basic amenities.',
    },
    {
      id: 'FLAT_APARTMENT',
      label: 'Flat Apartment',
      description: 'Standard residential units within a multi-story building.',
    },
    {
      id: 'INDEPENDENT_HOUSE',
      label: 'Preoccupied Apartment',
      description:
        'Apartments currently occupied by tenants, often available for investment.',
    },
  ];

  const configurations: ConfigType[] = [
    { label: '1 RK', id: 'ONE_RK' },
    { label: '1 BHK', id: 'ONE_BHK' },
    { label: '2 BHK', id: 'TWO_BHK' },
    { label: '3 BHK', id: 'THREE_BHK' },
    { label: '4 BHK', id: 'FOUR_BHK' },
    { label: '4+ BHK', id: 'FOUR_PLUS_BHK' },
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
        updateFilters('propertyType', [...newPropertyType]);
        break;
      }
      case 'configuration': {
        const newConfiguration = configuration.includes(id)
          ? configuration.filter((item) => item !== id)
          : [...configuration, id];
        dispatch(setConfiguration(newConfiguration));
        updateFilters('bhkType', [...newConfiguration]);
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
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1'>
        {options.map((option) => (
          <label
            key={option.id}
            className='flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-transparent hover:border-[#3b8ff6] hover:bg-blue-50  focus-within:ring-2 focus-within:ring-none transition-all duration-200 ease-in-out'
          >
            <input
              type='checkbox'
              checked={
                category === 'configuration'
                  ? configuration.includes(option.id)
                  : livingType.includes(option.id)
              }
              onChange={() => handleCheckboxChange(category, option.id)}
              className='w-5 h-5 rounded-md text-teal-500focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-200 ease-in-out'
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
          <div key={option.id} className='w-full'>
            <label className='flex flex-col items-start space-x-2 cursor-pointer pr-1 py-1 hover:bg-[#c1d2f5] rounded-2xl'>
              <span className='flex flex-row px-4 items-center text-black text-base sm:text-lg font-poppins font-medium leading-5 tracking-tighter w-full'>
                <input
                  type='checkbox'
                  checked={propertyType.includes(option.id)}
                  onChange={() => handleCheckboxChange(category, option.id)}
                  className='w-5 h-5 rounded-full focus-visible:border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300 text-black '
                />
                <div className='ml-2 text-xl'>{option.label}</div>
              </span>
              {/* <div className='flex flex-col justify-around px-4 space-y-2 rounded-md w-full'>
                <p className='text-gray-500 font-poppins text-[10px] font-normal leading-4 tracking-tighter'>
                  {option.description}
                </p>
              </div> */}
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
      <label className='text-xl font-medium block text-gray-800 leading-normal'>
        Property Type
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className='w-full rounded-md text-md text-gray-700 text-sm bg-[#e0e0e0] cursor-pointer flex items-center justify-between '>
            <div className='flex justify-center items-center text-nowrap gap-3 py-4 px-4 '>
              <RiHomeOfficeFill className='w-5 h-5' />
              {getDisplayText()}
              <ChevronDown />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-[90%] md:w-auto max-h-[70vh] overflow-y-auto'>
          <div className='space-y-2'>
            {/* <h3 className='text-xl font-semibold text-gray-800'>
              Property Details
            </h3> */}

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

            <div className='flex flex-col sm:flex-row justify-between gap-2'>
              <Button
                size='custom'
                className='w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md'
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              <Button
                size='custom'
                className='w-full sm:w-auto bg-[#3675ff] hover:bg-[#729eff] text-white px-4 py-2 rounded-md'
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
