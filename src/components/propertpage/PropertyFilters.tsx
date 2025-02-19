'use client';

import { useFilters } from '@/lib/context/FilterContext';
import PropertyComponent from '@/components/propertpage/PropertyComponent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useRef, useEffect } from 'react';

interface PropertyFiltersProps {
  onViewChange: (view: string) => void;
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PropertyFilters({ onViewChange }: PropertyFiltersProps) {
  const { filters, updateFilters } = useFilters();
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false);
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const configurationRef = useRef<HTMLDivElement>(null);

  const handlePropertyTypeChange = (value: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...filters.propertyType, value]
      : filters.propertyType.filter((type) => type !== value);
    updateFilters('propertyType', updatedTypes);
  };

  const handleConfigurationChange = (value: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...filters.bhkType, value]
      : filters.bhkType.filter((type) => type !== value);
    updateFilters('bhkType', updatedTypes);
  };

  const handleRadiusChange = (value: string) => {
    updateFilters('radius', value);
  };

  const propertyTypes = [
    'BUILDER_FLOOR',
    'VILLA',
    'CO_LIVING',
    'PG',
    'PREOCCUPIED_PROPERTY',
    'FLAT_APARTMENT',
  ];

  const bhkTypes = ['1', '2', '3', '4', '4+'];

  return (
    <div className='w-full mx-auto px-4 space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        {/* Radius Dropdown */}
        <Select onValueChange={handleRadiusChange} value={filters.radius || ''}>
          <SelectTrigger className='w-[120px] bg-white rounded-xl border-gray-200'>
            <SelectValue placeholder='Radius' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='5'>5 km</SelectItem>
            <SelectItem value='10'>10 km</SelectItem>
            <SelectItem value='15'>15 km</SelectItem>
            <SelectItem value='20'>20 km</SelectItem>
            <SelectItem value='25'>25+ km</SelectItem>
          </SelectContent>
        </Select>

        {/* Property Type Multi-Select */}
        <div ref={propertyTypeRef} className='relative'>
          <div
            className='w-[180px] bg-white rounded-xl border border-gray-200 px-3 py-2 cursor-pointer truncate'
            onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
          >
            {filters.propertyType.length > 0
              ? filters.propertyType.map(toTitleCase).join(', ')
              : 'Property Type'}
          </div>
          {isPropertyTypeOpen && (
            <div className='absolute top-full left-0 w-[180px] bg-white border border-gray-200 rounded-xl mt-1 z-10'>
              {propertyTypes.map((type) => (
                <div
                  key={type}
                  className='flex items-center space-x-2 px-3 py-2 hover:bg-gray-100'
                >
                  <Checkbox
                    checked={filters.propertyType.includes(type)}
                    onCheckedChange={(checked) =>
                      handlePropertyTypeChange(type, checked as boolean)
                    }
                  />
                  <span>{toTitleCase(type)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Multi-Select */}
        <div ref={configurationRef} className='relative'>
          <div
            className='w-[180px] bg-white rounded-xl border border-gray-200 px-3 py-2 cursor-pointer truncate'
            onClick={() => setIsConfigurationOpen(!isConfigurationOpen)}
          >
            {filters.bhkType.length > 0
              ? filters.bhkType.map((type) => `${type} BHK`).join(', ')
              : 'Configuration'}
          </div>
          {isConfigurationOpen && (
            <div className='absolute top-full left-0 w-[180px] bg-white border border-gray-200 rounded-xl mt-1 z-10'>
              {bhkTypes.map((type) => (
                <div
                  key={type}
                  className='flex items-center space-x-2 px-3 py-2 hover:bg-gray-100'
                >
                  <Checkbox
                    checked={filters.bhkType.includes(type)}
                    onCheckedChange={(checked) =>
                      handleConfigurationChange(type, checked as boolean)
                    }
                  />
                  <span>{`${type} BHK`}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rent Component */}
        <PropertyComponent />

        {/* View Change Tabs */}
        <Tabs
          defaultValue='list'
          className='w-[200px] ml-auto'
          onValueChange={onViewChange}
        >
          <TabsList className='grid w-full grid-cols-2 bg-[#F4F4F4] p-1 rounded-lg'>
            <TabsTrigger value='list'>List</TabsTrigger>
            <TabsTrigger value='map'>Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
