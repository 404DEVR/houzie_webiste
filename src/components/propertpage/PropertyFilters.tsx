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

interface PropertyFiltersProps {
  onViewChange: (view: string) => void;
}

// Helper function to convert snake_case to Title Case
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PropertyFilters({ onViewChange }: PropertyFiltersProps) {
  const { filters, updateFilters } = useFilters();

  const handlePropertyTypeChange = (value: string) => {
    if (value === '') {
      updateFilters('propertyType', []);
    } else {
      updateFilters('propertyType', [value]);
    }
  };

  const handleConfigurationChange = (value: string) => {
    if (value === '') {
      updateFilters('bhkType', []);
    } else {
      updateFilters('bhkType', [value]);
    }
  };

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

  return (
    <div className='w-full mx-auto px-4 space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <Select>
          <SelectTrigger className='w-[120px] bg-white rounded-xl border-gray-200'>
            <SelectValue placeholder='Radius' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='5'>5 km</SelectItem>
            <SelectItem value='10'>10 km</SelectItem>
            <SelectItem value='15'>15 km</SelectItem>
            <SelectItem value='20'>20 km</SelectItem>
            <SelectItem value='25'>20+ km</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handlePropertyTypeChange}>
          <SelectTrigger className='w-[140px] bg-white rounded-xl border-gray-200'>
            <SelectValue placeholder='Property Type' />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {toTitleCase(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleConfigurationChange}>
          <SelectTrigger className='w-[140px] bg-white rounded-xl border-gray-200'>
            <SelectValue placeholder='Configuration' />
          </SelectTrigger>
          <SelectContent>
            {bhkTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {toTitleCase(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <PropertyComponent />
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
