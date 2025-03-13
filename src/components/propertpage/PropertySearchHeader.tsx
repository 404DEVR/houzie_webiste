import { ChevronDown, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdBookmark } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { useFilters } from '@/lib/context/FilterContext';
import useAuth from '@/hooks/useAuth';

import PropertyComponent from '@/components/propertpage/PropertyComponent';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { RootState } from '@/redux/store';
import { PropertySearchHeaderProps } from '@/interfaces/PropsInterface';

export function PropertySearchHeader({
  onViewChange,
}: PropertySearchHeaderProps) {
  const { filters, updateFilters } = useFilters();
  const searchData = useSelector((state: RootState) => state.search);
  const { auth } = useAuth();
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [tempRent, setTempRent] = useState<[number, number]>([...filters.rent]);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [isSearchSaved, setIsSearchSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    const isAlreadySaved = savedSearches.some(
      (search) =>
        search.userId === auth?.userid &&
        JSON.stringify(search.searchData) === JSON.stringify(searchData)
    );
    setIsSearchSaved(isAlreadySaved);
  }, [savedSearches, filters, auth?.userid]);

  const handleSaveSearch = () => {
    if (!auth?.accessToken) {
      router.push('/login');
      return;
    }

    if (isSearchSaved) return;

    const newSearch = {
      userId: auth?.userid, // Assuming auth?.userId is available
      searchData: searchData,
      filters: filters, // Use filters from FilterContext
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
    setIsSearchSaved(true);
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

  const handlePropertyTypeChange = (value: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...filters.propertyType, value]
      : filters.propertyType.filter((type) => type !== value);
    updateFilters('propertyType', updatedTypes);
  };

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderRect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - sliderRect.left) / sliderRect.width) * 50000;
    const value = Math.min(Math.max(0, Math.round(position)), 50000);

    if (isDragging === 'min') {
      setTempRent([value, tempRent[1]]);
    } else if (isDragging === 'max') {
      setTempRent([tempRent[0], value]);
    }
  };

  const getLeftPosition = (value: number) => {
    return `${(value / 50000) * 100}%`;
  };

  const handleApplyRent = () => {
    updateFilters('rent', [tempRent[0], tempRent[1]]);
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `${Math.floor(price / 1000)}K`;
    }
    return price.toString();
  };

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='flex flex-col items-center gap-4 px-4 py-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex gap-2 w-[60%]'>
          <div className='flex items-center border-none rounded-full px-0 bg-[#eff5ff] flex-[2]'>
            <Input
              placeholder='Noida'
              className='border-none pl-6 placeholder:text-[#2d495f]  h-8 bg-transparent focus:ring-0 focus:outline-none w-full focus-visible:border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            />
            <Button
              variant='ghost'
              className='p-3 bg-[#3b8ff6] text-white rounded-full'
            >
              <Search className='' />
            </Button>
          </div>
          {/* Radius Filter */}
          <div className='flex-[1] w-full'>
            <Select
              onValueChange={handleRadiusChange}
              value={filters.radius || ''}
            >
              <SelectTrigger className='w-full text-md border-none rounded-lg focus:ring-0 bg-[#eff5ff] focus:outline-none focus-visible:border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'>
                <SelectValue placeholder='Radius' className=''>
                  Radius: {filters.radius} <ChevronDown />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5 km</SelectItem>
                <SelectItem value='10'>10 km</SelectItem>
                <SelectItem value='15'>15 km</SelectItem>
                <SelectItem value='20'>20 km</SelectItem>
                <SelectItem value='25'>25+ km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='w-[40%] flex justify-end items-center'>
          <Button
            onClick={handleSaveSearch}
            size='custom'
            disabled={isSearchSaved}
            className={`py-2 h-10 px-8 rounded-lg ${
              isSearchSaved
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#eff5ff] text-[#2d495f] '
            }`}
          >
            {isSearchSaved ? 'Search Saved' : 'Save Search'}
            <IoMdBookmark className='text-[#3b8ff6]' />
          </Button>
        </div>
      </div>

      <div className='w-full flex justify-between items-center gap-8'>
        <div className='w-[60%] flex justify-between items-center gap-10'>
          <div className='flex-[1] w-full'>
            <Popover>
              <PopoverTrigger asChild>
                <Button className='px-4 w-full border-none py-2 lex justify-between items-center rounded-lg bg-[#eff5ff] text-[#2d495f]'>
                  Rent: {formatPrice(tempRent[0])}-{formatPrice(tempRent[1])}
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80 p-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium'>Rent</h4>
                  <div className='relative w-[90%] mx-auto h-12'>
                    <div
                      className='absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2'
                      onMouseMove={(e) => isDragging && handleSliderChange(e)}
                      onMouseUp={() => setIsDragging(null)}
                      onMouseLeave={() => setIsDragging(null)}
                    >
                      <div
                        className='absolute h-2 bg-[#3b8ff6] rounded-full'
                        style={{
                          left: getLeftPosition(tempRent[0]),
                          right: `${100 - (tempRent[1] / 50000) * 100}%`,
                        }}
                      />
                      <button
                        className='absolute w-4 h-4 border-white border-2 bg-[#3b8ff6] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                        style={{ left: getLeftPosition(tempRent[0]) }}
                        onMouseDown={() => setIsDragging('min')}
                      />
                      <button
                        className='absolute w-4 h-4 border-white border-2 bg-[#3b8ff6] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                        style={{ left: getLeftPosition(tempRent[1]) }}
                        onMouseDown={() => setIsDragging('max')}
                      />
                    </div>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <Input
                      type='number'
                      value={tempRent[0]}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTempRent([value, tempRent[1]]);
                      }}
                      className='w-1/2'
                      placeholder='Min Rent'
                    />
                    <Input
                      type='number'
                      value={tempRent[1]}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTempRent([tempRent[0], value]);
                      }}
                      className='w-1/2'
                      placeholder='Max Rent'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      className='flex justify-center items-center text-white bg-[#3b8ff6]'
                      onClick={handleApplyRent}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className='flex-[2] w-full'>
            <Popover>
              <PopoverTrigger asChild>
                <Button className='px-4 w-full border-none py-2 rounded-lg flex justify-between items-center bg-[#eff5ff] text-[#2d495f]'>
                  {filters.propertyType.length > 0
                    ? filters.propertyType.map(toTitleCase).join(', ')
                    : 'Property Type'}
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80 p-4'>
                <div className='w-full mt-1 z-10'>
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
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className='w-[40%] flex justify-center items-center'>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className='px-4 py-2 border-none justify-between rounded-lg bg-[#eff5ff] text-[#2d495f] flex items-center gap-2'>
                  Add Filters
                  <Filter />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80 p-4'>
                <PropertyComponent />
              </PopoverContent>
            </Popover>
          </div>

          {/* View Toggle */}
          <Tabs
            defaultValue='list'
            className='ml-auto'
            onValueChange={onViewChange}
          >
            <TabsList className='flex gap-[10px] bg-gray rounded-md p-[2px]'>
              <TabsTrigger value='list'>List</TabsTrigger>
              <TabsTrigger value='map'>Map</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
