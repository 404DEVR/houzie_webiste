import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoMdBookmark } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { useFilters } from '@/lib/context/FilterContext';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/useAuth';

import CustomInput from '@/components/inputs/CustomInput';
import FilterComponent from '@/components/propertpage/FilterComponent';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { PropertySearchHeaderProps } from '@/interfaces/PropsInterface';
import { RootState } from '@/redux/store';

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
  const [tempPropertyTypes, setTempPropertyTypes] = useState<string[]>([
    ...filters.propertyType,
  ]);
  const [open, setOpen] = useState(false);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || '',
    libraries: ['places'],
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [tempRadius, setTempRadius] = useState<[number, number]>([
    ...filters.radius,
  ]);
  const [isRadiusDragging, setIsRadiusDragging] = useState<
    'min' | 'max' | null
  >(null);

  const getRadiusLeftPosition = (value: number) => {
    return `${(value / 100) * 100}%`;
  };

  const handleRadiusSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderRect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - sliderRect.left) / sliderRect.width) * 100;
    const value = Math.min(Math.max(0, Math.round(position)), 100);

    if (isRadiusDragging === 'min') {
      setTempRadius([value, tempRadius[1]]);
    } else if (isRadiusDragging === 'max') {
      setTempRadius([tempRadius[0], value]);
    }
    // setLeadsData((prevData) => ({ ...prevData, radiusRange: tempRadius }));
  };

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

    if (isSearchSaved) {
      // Remove the saved search
      const updatedSearches = savedSearches.filter(
        (search) =>
          !(
            search.userId === auth?.userid &&
            JSON.stringify(search.searchData) === JSON.stringify(searchData)
          )
      );
      setSavedSearches(updatedSearches);
      localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
      setIsSearchSaved(false);
    } else {
      // Save the search
      const newSearch = {
        userId: auth?.userid,
        searchData: searchData,
        filters: filters,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      const updatedSearches = [...savedSearches, newSearch];
      setSavedSearches(updatedSearches);
      localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
      setIsSearchSaved(true);
    }
  };

  const handleRadiusChange = () => {
    updateFilters('radius', [tempRadius[0], tempRadius[1]]);
  };

  const propertyTypes = [
    'BUILDER_FLOOR',
    'VILLA',
    'CO_LIVING',
    'PG',
    'PREOCCUPIED_PROPERTY',
    'FLAT_APARTMENT',
  ];

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setTempPropertyTypes([...tempPropertyTypes, type]);
    } else {
      setTempPropertyTypes(tempPropertyTypes.filter((t) => t !== type));
    }
  };

  const handleApplyPropertyTypes = () => {
    updateFilters('propertyType', tempPropertyTypes);
  };

  const handleClearPropertyTypes = () => {
    setTempPropertyTypes([]);
    updateFilters('propertyType', []);
  };

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderRect = e.currentTarget.getBoundingClientRect();
    const position =
      ((e.clientX - sliderRect.left) / sliderRect.width) * 500000;
    const value = Math.min(Math.max(0, Math.round(position)), 500000);

    if (isDragging === 'min') {
      setTempRent([value, tempRent[1]]);
    } else if (isDragging === 'max') {
      setTempRent([tempRent[0], value]);
    }
  };

  const getLeftPosition = (value: number) => {
    return `${(value / 500000) * 100}%`;
  };

  const handleApplyRent = () => {
    updateFilters('rent', [tempRent[0], tempRent[1]]);
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

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const handlePlaceChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.formatted_address) {
          updateFilters('location', place.formatted_address);
        }
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row items-center gap-2 md:gap-4 px-4 py-4 bg-white border-b-2 w-[95%] mx-auto'>
      <div className='flex items-center border-none rounded-full px-0 flex-[2] w-full md:max-w-[400px]'>
        {isLoaded && (
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
          >
            <div className='relative flex justify-between items-center w-full md:min-w-[400px] bg-[#eff5ff] rounded-full'>
              <input
                type='text'
                placeholder='Enter location...'
                defaultValue={filters.location || ''}
                className='border-none pl-6 placeholder:text-[#2d495f] h-8 bg-transparent focus:ring-0 flex-grow  focus:outline-none focus-visible:ring-0'
              />
              <Button
                variant='ghost'
                className='p-3 bg-[#3b8ff6] text-white rounded-full'
              >
                <Search className='' />
              </Button>
            </div>
          </StandaloneSearchBox>
        )}
      </div>
      <div className='flex-[1] w-full md:w-auto md:max-w-[200px]'>
        <Popover>
          <PopoverTrigger asChild>
            <Button className='px-4 w-full border-none py-2 lex justify-between items-center rounded-lg bg-[#eff5ff] text-[#2d495f]'>
              Radius
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 p-4'>
            <div className='space-y-2 '>
              <h4 className='font-medium'>Radius</h4>
              <div className='flex flex-col gap-0 '>
                <div className='relative w-[90%] mx-auto h-8'>
                  <div
                    className='absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2'
                    onMouseMove={(e) =>
                      isRadiusDragging && handleRadiusSliderChange(e)
                    }
                    onMouseUp={() => setIsRadiusDragging(null)}
                    onMouseLeave={() => setIsRadiusDragging(null)}
                  >
                    <div
                      className='absolute h-2 bg-[#3b8ff6] rounded-full'
                      style={{
                        left: getRadiusLeftPosition(tempRadius[0]),
                        right: `${100 - (tempRadius[1] / 100) * 100}%`,
                      }}
                    />
                    <button
                      className='absolute w-4 h-4 border-white border-2 bg-[#3b8ff6] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                      style={{
                        left: getRadiusLeftPosition(tempRadius[1]),
                      }}
                      onMouseDown={() => setIsRadiusDragging('max')}
                    />
                  </div>
                </div>
                <p className='text-gray-500 text-xs pl-2'>Radius Range</p>
              </div>
              <div className='flex justify-between gap-2'>
                <CustomInput
                  name='radius0'
                  type='number'
                  value={tempRadius[0]}
                  unit='KM'
                  onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTempRadius([value, tempRadius[1]]);
                  }}
                  error={fieldErrors['radius0'] ? 'This field is required' : ''}
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1':
                        fieldErrors['radius0'],
                    }
                  )}
                  required
                />
                <CustomInput
                  name='radius1'
                  type='number'
                  unit='KM'
                  value={tempRadius[1]}
                  onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTempRadius([tempRadius[0], value]);
                  }}
                  error={fieldErrors['radius1'] ? 'This field is required' : ''}
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1':
                        fieldErrors['radius1'],
                    }
                  )}
                  required
                />
              </div>
              <Button
                type='button'
                size='custom'
                variant='outline'
                className='flex justify-center items-center w-full py-2 text-white bg-[#3b8ff6]'
                onClick={handleRadiusChange}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex-[1] w-full md:w-auto md:max-w-[200px]'>
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
              <div
                className='flex flex-col
              gap-0 '
              >
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
                        left: getLeftPosition(tempRent[0]),
                        right: `${100 - (tempRent[1] / 500000) * 100}%`,
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
                <p className='text-gray-500 text-xs pl-2'>Rent Range</p>
              </div>
              <div className='flex justify-between gap-2'>
                <CustomInput
                  name='rent0'
                  type='number'
                  firstUnit='₹'
                  value={tempRent[0]}
                  onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTempRent([value, tempRent[1]]);
                  }}
                  error={fieldErrors['rent0'] ? 'This field is required' : ''}
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1': fieldErrors['rent0'],
                    }
                  )}
                  required
                />
                <CustomInput
                  name='rent1'
                  type='number'
                  firstUnit='₹'
                  value={tempRent[1]}
                  onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTempRent([tempRent[0], value]);
                  }}
                  error={fieldErrors['rent1'] ? 'This field is required' : ''}
                  className={cn(
                    'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                    {
                      'ring-2 ring-red-500 ring-offset-1': fieldErrors['rent1'],
                    }
                  )}
                  required
                />
              </div>
              <Button
                type='button'
                size='custom'
                variant='outline'
                className='flex justify-center items-center w-full py-2 text-white bg-[#3b8ff6]'
                onClick={handleApplyRent}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className='flex-[1] w-full md:w-auto md:max-w-[200px]'>
        <Popover>
          <PopoverTrigger asChild>
            <Button className='w-full  py-2 rounded-lg flex justify-between items-center bg-[#eff5ff] text-[#2d495f]'>
              <span className=' truncate mr-2'>
                {tempPropertyTypes.length > 0
                  ? tempPropertyTypes.map(toTitleCase).join(', ')
                  : 'Property Type'}
              </span>
              <ChevronDown className='flex-shrink-0' />
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
                    checked={tempPropertyTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      handlePropertyTypeChange(type, checked as boolean)
                    }
                  />
                  <span>{toTitleCase(type)}</span>
                </div>
              ))}
              <div className='flex justify-between gap-2 mt-2'>
                <Button
                  type='button'
                  size='custom'
                  variant='outline'
                  className='bg-[#eeeefa] text-[#f66659] hover:bg-[#f66659] hover:text-[#f5f5fa] px-6 font-normal py-2 rounded-md border-none'
                  onClick={handleClearPropertyTypes}
                >
                  Clear All
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='custom'
                  className='bg-[#eeeefa] text-[#3b8ff6] hover:bg-[#3b8ff6] hover:text-white px-6 font-normal py-2 rounded-md border-none'
                  onClick={handleApplyPropertyTypes}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className='w-full md:w-auto flex-[1] md:max-w-[200px]'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className='px-4 w-full py-2 border-none justify-between rounded-lg bg-[#eff5ff] text-[#2d495f] flex items-center gap-2'>
              Add Filters
              <SlidersHorizontal className='text-[#3b8ff6]' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 p-4'>
            <FilterComponent setOpen={setOpen} />
          </PopoverContent>
        </Popover>
      </div>
      <div className=' flex justify-start md:justify-end items-center w-full md:w-auto md:max-w-[200px]'>
        <Button
          onClick={handleSaveSearch}
          size='custom'
          className={`py-2 h-10 px-8 rounded-lg ${
            isSearchSaved
              ? '  bg-[#3b8ff6] text-white '
              : 'border border-[#3b8ff6] bg-white text-[#3b8ff6]'
          }`}
        >
          {isSearchSaved ? 'search saved' : 'Save Search'}
          <IoMdBookmark
            className={`${isSearchSaved ? 'text-white' : 'text-[#3b8ff6]'}`}
          />
        </Button>
      </div>
    </div>
  );
}
