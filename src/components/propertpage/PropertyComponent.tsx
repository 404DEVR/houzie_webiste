import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useFilters } from '@/lib/context/FilterContext';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyComponentProps } from '@/interfaces/PropsInterface';

// Function to convert string to title case
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to convert BHK type to numeric value
function bhkToNumeric(bhkType: string): string {
  switch (bhkType) {
    case 'ONE_RK':
      return '1 RK';
    case 'ONE_BHK':
      return '1 BHK';
    case 'TWO_BHK':
      return '2 BHK';
    case 'THREE_BHK':
      return '3 BHK';
    case 'FOUR_BHK':
      return '4 BHK';
    case 'FOUR_PLUS_BHK':
      return '4+ BHK';
    default:
      return 'Unknown';
  }
}

export default function PropertyComponent({ setOpen }: PropertyComponentProps) {
  const { filters, updateFilters } = useFilters();
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [tempRent, setTempRent] = useState<[number, number]>([...filters.rent]);

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

  const availableForTypes = ['FAMILY', 'BACHELOR', 'COMPANY_LEASE', 'ANY'];
  const furnishingTypes = ['FULLY_FURNISHED', 'SEMI_FURNISHED', 'NONE'];
  const allAmenities = [
    'WIFI',
    'POWER_BACKUP',
    'FOUR_WHEELER_PARKING',
    'TWO_WHEELER_PARKING',
    'WATER_SUPPLY_24_7',
    'SECURITY_24_7',
    'DAILY_HOUSEKEEPING',
    'CCTV',
    'MEALS',
    'COUPLE_FRIENDLY',
    'PET_FRIENDLY',
    'OWNER_FREE',
    'BALCONY',
    'ATTACHED_BATHROOM',
    'GATED_COMMUNITY',
  ];
  const parkingTypes = ['TWO_WHEELER_PARKING', 'FOUR_WHEELER_PARKING'];

  const [isBHKOpen, setIsBHKOpen] = useState(false);
  const [isAvailableForOpen, setIsAvailableForOpen] = useState(false);
  const [isFurnishingOpen, setIsFurnishingOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isParkingOpen, setIsParkingOpen] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    bhkType: [...filters.bhkType],
    availableFor: [...filters.availableFor],
    furnishing: [...filters.furnishing],
    amenities: [...filters.amenities],
    parking: [...filters.parking],
  });

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

  const handleCheckboxChange = useCallback(
    (
      key: 'bhkType' | 'availableFor' | 'furnishing' | 'amenities' | 'parking',
      value: string,
      checked: boolean | string
    ) => {
      const currentValue = localFilters[key];
      let newValue: string[];

      if (checked) {
        newValue = [...currentValue, value];
      } else {
        newValue = currentValue.filter((item) => item !== value);
      }

      setLocalFilters((prevFilters) => ({ ...prevFilters, [key]: newValue }));
    },
    [localFilters, setLocalFilters]
  );

  const handleApplyRent = () => {
    updateFilters('rent', [tempRent[0], tempRent[1]]);
    updateFilters('bhkType', localFilters.bhkType);
    updateFilters('availableFor', localFilters.availableFor);
    updateFilters('furnishing', localFilters.furnishing);
    updateFilters('amenities', localFilters.amenities);
    updateFilters('parking', localFilters.parking);
  };

  const handleDropdownToggle = (dropdown: string) => {
    switch (dropdown) {
      case 'bhkType':
        setIsBHKOpen(!isBHKOpen);
        setIsAvailableForOpen(false);
        setIsFurnishingOpen(false);
        setIsAmenitiesOpen(false);
        setIsParkingOpen(false);
        break;
      case 'availableFor':
        setIsAvailableForOpen(!isAvailableForOpen);
        setIsBHKOpen(false);
        setIsFurnishingOpen(false);
        setIsAmenitiesOpen(false);
        setIsParkingOpen(false);
        break;
      case 'furnishing':
        setIsFurnishingOpen(!isFurnishingOpen);
        setIsBHKOpen(false);
        setIsAvailableForOpen(false);
        setIsAmenitiesOpen(false);
        setIsParkingOpen(false);
        break;
      case 'amenities':
        setIsAmenitiesOpen(!isAmenitiesOpen);
        setIsBHKOpen(false);
        setIsAvailableForOpen(false);
        setIsFurnishingOpen(false);
        setIsParkingOpen(false);
        break;
      case 'parking':
        setIsParkingOpen(!isParkingOpen);
        setIsBHKOpen(false);
        setIsAvailableForOpen(false);
        setIsFurnishingOpen(false);
        setIsAmenitiesOpen(false);
        break;
      default:
        break;
    }
  };

  const handleClearAll = () => {
    updateFilters('bhkType', []);
    updateFilters('availableFor', []);
    updateFilters('furnishing', []);
    updateFilters('amenities', []);
    updateFilters('parking', []);
    if (setOpen) {
      setOpen(false);
    }
  };
  return (
    <div className=''>
      <div className='space-y-2'>
        <div className='space-y-0'>
          <div
            className='flex justify-between items-center cursor-pointer p-2 bg-[#eff5ff] rounded-lg'
            onClick={() => handleDropdownToggle('bhkType')}
          >
            <span>BHK Type</span>
            <ChevronDown className={isBHKOpen ? 'rotate-180' : ''} />
          </div>
          {isBHKOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className='bg-white shadow-md rounded-lg p-2 mt-2'
            >
              {bhkTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2 py-2'>
                  <Checkbox
                    checked={localFilters.bhkType.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('bhkType', type, checked)
                    }
                  />
                  <label className='text-sm'>{bhkToNumeric(type)}</label>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Available For Dropdown */}
        <div className='space-y-2'>
          <div
            className='flex justify-between items-center cursor-pointer p-2 bg-[#eff5ff] rounded-lg'
            onClick={() => handleDropdownToggle('availableFor')}
          >
            <span>Available For</span>
            <ChevronDown className={isAvailableForOpen ? 'rotate-180' : ''} />
          </div>
          {isAvailableForOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className='bg-white shadow-md rounded-lg p-2 mt-2'
            >
              {availableForTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2 py-2'>
                  <Checkbox
                    checked={localFilters.availableFor.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('availableFor', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Furnishing Dropdown */}
        <div className='space-y-2'>
          <div
            className='flex justify-between items-center cursor-pointer p-2 bg-[#eff5ff] rounded-lg'
            onClick={() => handleDropdownToggle('furnishing')}
          >
            <span>Furnishing</span>
            <ChevronDown className={isFurnishingOpen ? 'rotate-180' : ''} />
          </div>
          {isFurnishingOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className='bg-white shadow-md rounded-lg p-2 mt-2'
            >
              {furnishingTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2 py-2'>
                  <Checkbox
                    checked={localFilters.furnishing.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('furnishing', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Amenities Dropdown */}
        <div className='space-y-2'>
          <div
            className='flex justify-between items-center cursor-pointer p-2 bg-[#eff5ff] rounded-lg'
            onClick={() => handleDropdownToggle('amenities')}
          >
            <span>Amenities</span>
            <ChevronDown className={isAmenitiesOpen ? 'rotate-180' : ''} />
          </div>
          {isAmenitiesOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className='bg-white shadow-md rounded-lg p-2 mt-2 max-h-[300px] overflow-y-auto'
            >
              {allAmenities.map((type) => (
                <div key={type} className='flex items-center space-x-2 py-2'>
                  <Checkbox
                    checked={localFilters.amenities.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('amenities', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Parking Dropdown */}
        <div className='space-y-2'>
          <div
            className='flex justify-between items-center cursor-pointer p-2 bg-[#eff5ff] rounded-lg'
            onClick={() => handleDropdownToggle('parking')}
          >
            <span>Parking</span>
            <ChevronDown className={isParkingOpen ? 'rotate-180' : ''} />
          </div>
          {isParkingOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className='bg-white shadow-md rounded-lg p-2 mt-2'
            >
              {parkingTypes.map((type) => (
                <div key={type} className='flex items-center space-x-2 py-2'>
                  <Checkbox
                    checked={localFilters.parking.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('parking', type, checked)
                    }
                  />
                  <label className='text-sm'>{toTitleCase(type)}</label>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className='flex justify-between gap-2 mt-4'>
          <Button
            variant='outline'
            className='bg-[#f5f5fa] text-[#3b8ff6] hover:bg-[#3b8ff6] hover:text-white px-4 font-normal py-4 rounded-lg border-none'
            onClick={handleApplyRent}
          >
            Apply
          </Button>
          <Button
            variant='outline'
            className='bg-[#f5f5fa] text-[#f66659] hover:bg-[#f66659] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
