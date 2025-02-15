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

export function PropertyFilters({ onViewChange }: PropertyFiltersProps) {
  const { filters, updateFilters } = useFilters();

  // const handleRadiusChange = (value: string) => {
  //   updateFilters('radius', value);
  // };

  const handlePropertyTypeChange = (value: string) => {
    updateFilters('propertyType', [value]);
  };

  const handleConfigurationChange = (value: string) => {
    updateFilters('bhkType', [value]);
  };

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
            <SelectItem value='Flat/apartment'>Apartment</SelectItem>
            <SelectItem value='Villa'>Villa</SelectItem>
            <SelectItem value='House'>House</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleConfigurationChange}>
          <SelectTrigger className='w-[140px] bg-white rounded-xl border-gray-200'>
            <SelectValue placeholder='Configuration' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1 BHK'>1 BHK</SelectItem>
            <SelectItem value='2 BHK'>2 BHK</SelectItem>
            <SelectItem value='3 BHK'>3 BHK</SelectItem>
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
