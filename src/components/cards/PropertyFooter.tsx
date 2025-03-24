import axios from 'axios';
import { CalendarIcon, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import useAuth from '@/hooks/useAuth';

import CustomInput from '@/components/inputs/CustomInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

import { UserData } from '@/interfaces/Interface';

interface Leads {
  location: string;
  propertyType: string[];
  availableFrom: string;
  preferredTenant: string[];
  features: string[];
  furnishing: string;
  configuration: string;
  rentRange: [number, number];
  radiusRange: [number, number];
  message?: string;
}

const PropertyFooter = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [tempRadius, setTempRadius] = useState<[number, number]>([0, 100]);
  const [isRadiusDragging, setIsRadiusDragging] = useState<
    'min' | 'max' | null
  >(null);
  const [tempRent, setTempRent] = useState<[number, number]>([0, 500000]);
  const [isRentDragging, setIsRentDragging] = useState<'min' | 'max' | null>(
    null
  );
  const { auth } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [successDialog, setSuccessDialog] = useState(false);
  const [leadsData, setLeadsData] = useState<Leads>({
    location: '',
    availableFrom: '',
    propertyType: [],
    preferredTenant: [],
    features: [],
    furnishing: '',
    configuration: '',
    rentRange: [0, 500000],
    radiusRange: [0, 100],
  });

  const propertyType = [
    {
      label: 'Builder Floor',
      value: 'BUILDER_FLOOR',
      url: '/svg/builder.svg',
    },
    { label: 'Villa', value: 'VILLA', url: '/svg/villa.svg' },
    { label: 'Co-living', value: 'CO_LIVING', url: '/svg/Coliving.svg' },
    { label: 'PG', value: 'PG', url: '/svg/PG.svg' },
    {
      label: 'Flat/Apartment',
      value: 'FLAT_APARTMENT',
      url: '/svg/flat.svg',
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setLeadsData((prevData) => ({ ...prevData, [name]: value }));

    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleButtonClick = (name: string, value: string) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    if (name === 'configuration') {
      setLeadsData((prevData) => ({ ...prevData, configuration: value }));
    } else if (name === 'furnishing') {
      setLeadsData((prevData) => ({ ...prevData, furnishing: value }));
    }
  };

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
    setLeadsData((prevData) => ({ ...prevData, radiusRange: tempRadius }));
  };

  const handleRentSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderRect = e.currentTarget.getBoundingClientRect();
    const position =
      ((e.clientX - sliderRect.left) / sliderRect.width) * 500000;
    const value = Math.min(Math.max(0, Math.round(position)), 500000);

    if (isRentDragging === 'min') {
      setTempRent([value, tempRent[1]]);
    } else if (isRentDragging === 'max') {
      setTempRent([tempRent[0], value]);
    }
    setLeadsData((prevData) => ({ ...prevData, rentRange: tempRent }));
  };

  const tenantType = [
    { label: 'Family', value: 'FAMILY' },
    { label: 'Bachelors', value: 'BACHELOR' },
    { label: 'Company Lease', value: 'COMPANY_LEASE' },
    { label: 'Any', value: 'ANY' },
  ];

  const furnishingLevels = [
    { label: 'Fully Furnished', value: 'FULLY_FURNISHED' },
    { label: 'Semi Furnished', value: 'SEMI_FURNISHED' },
    { label: 'Unfurnished', value: 'NONE' },
  ];

  const feature = [
    { label: 'Couple Friendly', value: 'COUPLE_FRIENDLY' },
    { label: 'Pet Friendly', value: 'PET_FRIENDLY' },
    { label: 'Owner Free', value: 'OWNER_FREE' },
  ];

  const configuration = [
    { label: '1 RK', value: 'ONE_RK' },
    { label: '1 BHK', value: 'ONE_BHK' },
    { label: '2 BHK', value: 'TWO_BHK' },
    { label: '3 BHK', value: 'THREE_BHK' },
    { label: '4 BHK', value: 'FOUR_BHK' },
    { label: '4+ BHK', value: 'FOUR_PLUS_BHK' },
  ];

  const getRentLeftPosition = (value: number) => {
    return `${(value / 500000) * 100}%`;
  };

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      return '';
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth?.userid) {
        const response = await axios.get(`https://api.houzie.in/profile`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setUserData(response.data);
      }
    };
    fetchUserData();
  }, [auth]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatDateForAPI(date.toISOString());
      setLeadsData((prevData) => ({
        ...prevData,
        availableFrom: formattedDate,
      }));
    }

    setFieldErrors((prevErrors) => ({ ...prevErrors, availableFrom: false }));
  };

  const handleTenantClick = (value: string) => {
    const isSelected = leadsData.preferredTenant.includes(value);
    let updatedTenants;

    if (value === 'ANY') {
      if (isSelected) {
        updatedTenants = leadsData.preferredTenant.filter(
          (item) => item !== value
        );
      } else {
        updatedTenants = ['ANY'];
      }
    } else {
      if (leadsData.preferredTenant.includes('ANY')) {
        updatedTenants = [value];
      } else {
        if (isSelected) {
          updatedTenants = leadsData.preferredTenant.filter(
            (item) => item !== value
          );
        } else {
          updatedTenants = [...leadsData.preferredTenant, value];
        }
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      preferredTenant: false,
    }));
    setLeadsData((prevData) => ({
      ...prevData,
      preferredTenant: updatedTenants,
    }));
  };

  const handleFeatureClick = (value: string) => {
    const isSelected = leadsData.features.includes(value);
    let updatedFeatures;

    if (isSelected) {
      updatedFeatures = leadsData.features.filter((item) => item !== value);
    } else {
      updatedFeatures = [...leadsData.features, value];
    }

    setFieldErrors((prevErrors) => ({ ...prevErrors, features: false }));
    setLeadsData((prevData) => ({ ...prevData, features: updatedFeatures }));
  };
  const handlePropertyClick = (value: string) => {
    const isSelected = leadsData.propertyType.includes(value);
    let updatedProperty;

    if (isSelected) {
      updatedProperty = leadsData.propertyType.filter((item) => item !== value);
    } else {
      updatedProperty = [...leadsData.propertyType, value];
    }

    setFieldErrors((prevErrors) => ({ ...prevErrors, propertyType: false }));
    setLeadsData((prevData) => ({
      ...prevData,
      propertyType: updatedProperty,
    }));
  };

  const getRequiredFields = () => {
    const commonFields = [
      'location',
      'propertyType',
      'configuration',
      'furnishing',
      'availableFrom',
      'preferredTenant',
      'features',
    ];
    return commonFields;
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = getRequiredFields();

    requiredFields.forEach((field) => {
      const value = leadsData[field];
      if (Array.isArray(value)) {
        errors[field] = value.length === 0;
      } else {
        errors[field] = !value;
      }
    });
    return errors;
  };

  const handleSend = async () => {
    const errors = validateForm();
    setFieldErrors(errors);

    const errorFields = Object.keys(errors).filter((key) => errors[key]);

    if (errorFields.length > 0) {
      return;
    }

    const formdata = {
      name: userData?.name || '',
      phoneNumber: userData?.phoneNumber || '',
      email: userData?.email || '',
      budgetMin: leadsData.rentRange[0],
      budgetMax: leadsData.rentRange[1],
      preferredLocations: [],
      propertyTypes: leadsData.propertyType,
      note: '',
    };
    try {
      await axios.post(
        'https://api.houzie.in/leads',
        formdata,

        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        }
      );
      setSuccessDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='flex flex-col md:flex-row items-center justify-start gap-4 md:gap-16  max-w-7xl mx-auto'>
        {/* Left Section: Image */}
        <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-6'>
          <Image
            src='/svg/PropertyFooter.svg'
            alt='Detective Icon'
            width={200}
            height={200}
            priority
            className='w-full h-auto'
          />
        </div>

        {/* Right Section: Text and Button */}
        <div className='flex flex-col items-start text-start'>
          <h2 className='text-2xl lg:text-5xl font-bold text-gray-800 mb-2'>
            Still searching for the perfect home?
          </h2>
          <p className='text-gray-600 mb-4 text-sm md:text-base lg:text-3xl font-semibold'>
            Share your preferences with us, and we'll reach out when a suitable
            property comes up!
          </p>
          <Dialog>
            <DialogTrigger>
              <Button
                size='custom'
                className='bg-blue-500 text-white flex justify-between py-2 px-4 rounded-md hover:bg-blue-600'
              >
                Submit Preference
                <ChevronRight />
              </Button>
            </DialogTrigger>
            <DialogContent className='h-[90%] max-w-[90%] md:w-[70%] lg:max-w-[40%] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  <h1 className='text-xl font-semibold text-black'>
                    Submit Preference
                  </h1>
                  <p className='text-xs text-gray-600 font-normal'>
                    Submit us your preferences for getting suggestions through
                    mail
                  </p>
                </DialogTitle>
                <DialogDescription className='h-full flex flex-col space-y-3'>
                  <CustomInput
                    type='text'
                    name='location'
                    label='Location'
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    value={leadsData.location || ''}
                    onChange={handleInputChange}
                    error={
                      fieldErrors['location'] ? 'This field is required' : ''
                    }
                    className={cn(
                      'placeholder:text-[#646464] col-span-1 text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                      {
                        'ring-2 ring-red-500 ring-offset-1':
                          fieldErrors['location'],
                      }
                    )}
                    placeholder='Enter Location'
                  />
                  <div className=''>
                    <Label className='text-md text-black font-normal'>
                      Property Type<span className='text-red-500'>*</span>
                    </Label>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {propertyType.map((type) => (
                        <Button
                          key={type.value}
                          className={cn(
                            'rounded-md border-2 w-28 h-28 flex flex-col items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                            leadsData.propertyType.includes(type.value)
                              ? 'bg-[#bfd7fe] text-[#646464] border-gray-300'
                              : 'bg-white text-[#646464] border-gray-300 hover:bg-gray-100'
                          )}
                          onClick={() => handlePropertyClick(type.value)}
                        >
                          <Image
                            src={type.url}
                            alt={type.label}
                            width={55}
                            height={55}
                            className={`object-contain `}
                          />
                          <div className=' text-center text-xs text-wrap'>
                            {type.label}
                          </div>
                        </Button>
                      ))}
                    </div>
                    {fieldErrors['propertyType'] && (
                      <p className='text-red-500 text-sm mt-1'>
                        Please select a Property Type
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col md:flex-row gap-2 my-2'>
                    <div className='space-y-2  border rounded-lg p-3'>
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
                                left: getRadiusLeftPosition(tempRadius[0]),
                              }}
                              onMouseDown={() => setIsRadiusDragging('min')}
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
                        <p className='text-gray-500 text-xs pl-2'>
                          Radius Range
                        </p>
                      </div>
                      <div className='flex justify-between gap-2'>
                        <CustomInput
                          name='radius0'
                          type='number'
                          value={tempRadius[0]}
                          unit='KM'
                          onWheel={(e) =>
                            (e.currentTarget as HTMLElement).blur()
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setTempRadius([value, tempRadius[1]]);
                          }}
                          error={
                            fieldErrors['radius0']
                              ? 'This field is required'
                              : ''
                          }
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
                          onWheel={(e) =>
                            (e.currentTarget as HTMLElement).blur()
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setTempRadius([tempRadius[0], value]);
                          }}
                          error={
                            fieldErrors['radius1']
                              ? 'This field is required'
                              : ''
                          }
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
                      {/* <Button
                      type='button'
                      size='custom'
                      variant='outline'
                      className='flex justify-center items-center w-full py-1 text-white bg-[#3b8ff6]'
                      onClick={handleApplyRadius}
                    >
                      Apply
                    </Button> */}
                    </div>
                    <div className='space-y-2 border rounded-lg p-3'>
                      <h4 className='font-medium'>Rent</h4>
                      <div className='flex flex-col gap-0'>
                        <div className='relative w-[90%] mx-auto h-8'>
                          <div
                            className='absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2'
                            onMouseMove={(e) =>
                              isRentDragging && handleRentSliderChange(e)
                            }
                            onMouseUp={() => setIsRentDragging(null)}
                            onMouseLeave={() => setIsRentDragging(null)}
                          >
                            <div
                              className='absolute h-2 bg-[#3b8ff6] rounded-full'
                              style={{
                                left: getRentLeftPosition(tempRent[0]),
                                right: `${100 - (tempRent[1] / 500000) * 100}%`,
                              }}
                            />
                            <button
                              className='absolute w-4 h-4 border-white border-2 bg-[#3b8ff6] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                              style={{ left: getRentLeftPosition(tempRent[0]) }}
                              onMouseDown={() => setIsRentDragging('min')}
                            />
                            <button
                              className='absolute w-4 h-4 border-white border-2 bg-[#3b8ff6] rounded-full -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform'
                              style={{ left: getRentLeftPosition(tempRent[1]) }}
                              onMouseDown={() => setIsRentDragging('max')}
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
                          onWheel={(e) =>
                            (e.currentTarget as HTMLElement).blur()
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setTempRent([value, tempRent[1]]);
                          }}
                          error={
                            fieldErrors['rent0'] ? 'This field is required' : ''
                          }
                          className={cn(
                            'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                            {
                              'ring-2 ring-red-500 ring-offset-1':
                                fieldErrors['rent0'],
                            }
                          )}
                          required
                        />
                        <CustomInput
                          name='rent1'
                          type='number'
                          firstUnit='₹'
                          value={tempRent[1]}
                          onWheel={(e) =>
                            (e.currentTarget as HTMLElement).blur()
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setTempRent([tempRent[0], value]);
                          }}
                          error={
                            fieldErrors['rent1'] ? 'This field is required' : ''
                          }
                          className={cn(
                            'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                            {
                              'ring-2 ring-red-500 ring-offset-1':
                                fieldErrors['rent1'],
                            }
                          )}
                          required
                        />
                      </div>
                      {/* <Button
                      type='button'
                      size='custom'
                      variant='outline'
                      className='flex justify-center items-center w-full py-1 text-white bg-[#3b8ff6]'
                      onClick={handleApplyRent}
                    >
                      Apply
                    </Button> */}
                    </div>
                  </div>
                  <div className='w-full flex flex-col'>
                    <Label
                      htmlFor='availableFrom'
                      className='text-md text-black font-normal mb-3'
                    >
                      Available From<span className='text-red-500'>*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className='w-full pl-3 text-left font-normal'
                        >
                          {leadsData.availableFrom ? (
                            formatDateForInput(leadsData.availableFrom)
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={
                            leadsData.availableFrom
                              ? new Date(leadsData.availableFrom)
                              : undefined
                          }
                          onDayClick={(date) => {
                            handleDateChange(date);
                          }}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          fromDate={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldErrors['availableFrom'] && (
                      <p className='text-red-500 text-sm mt-1'>
                        Please select an available date
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className='text-md text-black font-normal'>
                      Furnishing Level<span className='text-red-500'>*</span>
                    </Label>
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {furnishingLevels.map((level) => (
                        <Button
                          key={level.value}
                          className={cn(
                            'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                            leadsData.furnishing === level.value
                              ? 'bg-[#bfd7fe] text-[#646464] border-gray-300'
                              : 'bg-white text-[#646464] '
                          )}
                          onClick={() =>
                            handleButtonClick('furnishing', level.value)
                          }
                        >
                          {level.label}
                        </Button>
                      ))}
                    </div>
                    {fieldErrors['furnishing'] && (
                      <p className='text-red-500 text-sm mt-1'>
                        Please select a furnishing level
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className='text-md text-black font-normal'>
                      Preferred Tenant Type
                      <span className='text-red-500'>*</span>
                    </Label>
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {tenantType.map((tenant) => (
                        <Button
                          key={tenant.value}
                          className={cn(
                            'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                            leadsData.preferredTenant.includes(tenant.value)
                              ? 'bg-[#bfd7fe] text-[#646464] border-gray-300'
                              : 'bg-white text-[#646464] '
                          )}
                          onClick={() => handleTenantClick(tenant.value)}
                        >
                          {tenant.label}
                        </Button>
                      ))}
                    </div>
                    {fieldErrors['preferredTenant'] && (
                      <p className='text-red-500 text-sm mt-1'>
                        Please select a Tenant Type
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className='text-md text-black font-normal'>
                      Features
                    </Label>
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {feature.map((feature) => (
                        <Button
                          key={feature.value}
                          className={cn(
                            'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                            leadsData.features.includes(feature.value)
                              ? 'bg-[#bfd7fe] text-[#646464] border-gray-300'
                              : 'bg-white text-[#646464] '
                          )}
                          onClick={() => handleFeatureClick(feature.value)}
                        >
                          {feature.label}
                        </Button>
                      ))}
                    </div>
                    {fieldErrors['features'] && (
                      <p className='text-red-500 text-sm mt-1'>
                        Please select an Features
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className='text-md text-black font-normal'>
                      Configuration<span className='text-red-500'>*</span>
                    </Label>
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {configuration.map((type) => (
                        <Button
                          key={type.value}
                          className={cn(
                            'rounded-lg px-4 py-2 border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                            leadsData.configuration === type.value
                              ? 'bg-[#bfd7fe] text-[#646464] border-gray-300'
                              : 'bg-white text-[#646464] '
                          )}
                          onClick={() =>
                            handleButtonClick('configuration', type.value)
                          }
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                    {fieldErrors['configuration'] && (
                      <p className='text-red-500 text-sm mt-1'>
                        Please select an Configuration
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className='text-md text-black font-normal'>
                      Message
                    </Label>
                    <Textarea
                      className='mt-3 focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      value={leadsData.message || ''}
                      name='message'
                      id='message'
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <Button
                    size='custom'
                    className='flex justify-center items-center w-auto px-4 py-2  text-white bg-[#3b8ff6]'
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>{' '}
      <Dialog onOpenChange={setSuccessDialog} open={successDialog}>
        <DialogContent className='h-auto overflow-y-auto'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className='flex flex-col justify-center items-center space-y-3'>
            <Image
              src='/svg/success.svg'
              alt='/svg/success.svg'
              width={100}
              height={100}
            />
            <div className='flex flex-col gap-8 justify-center  items-center'>
              <h1 className='text-2xl font-semibold'>
                Request Raised Successfully
              </h1>
              <p className='text-sm text-gray-700'>
                Thank you for sharing your preferences! Our team will review
                your requirements, and we'll notify you if a matching property
                becomes available.<br></br> Stay tuned for updates!
              </p>
            </div>

            <Button
              size='custom'
              className='flex justify-center items-center w-auto p-4  text-white bg-[#3b8ff6]'
              onClick={() => setSuccessDialog(false)}
            >
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyFooter;
