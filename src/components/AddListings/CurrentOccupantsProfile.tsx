'use client';

import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils'; // Assuming you have this utility function

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CurrentOccupantsProfileProps {
  onOccupantDataChange: (isValid: boolean) => void;
}

const CurrentOccupantsProfile = ({
  onOccupantDataChange,
}: CurrentOccupantsProfileProps) => {
  const [totalOccupants, setTotalOccupants] = useState('1 person');
  const [occupantData, setOccupantData] = useState([
    {
      name: '',
      age: '',
      profession: '',
      about: '',
    },
    {
      name: '',
      age: '',
      profession: '',
      about: '',
    },
    {
      name: '',
      age: '',
      profession: '',
      about: '',
    },
  ]);

  const handleOccupantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOccupantData = [...occupantData];
    updatedOccupantData[index] = {
      ...updatedOccupantData[index],
      [name]: value,
    };
    setOccupantData(updatedOccupantData);
  };

  const handleAgeChange = (index, e) => {
    const value = Math.max(0, Number(e.target.value));
    handleOccupantChange(index, {
      target: { name: 'age', value: value.toString() },
    });
  };

  const occupantOptions = ['None', '1 person', '2 person', '3 person'];

  const getNumberOfOccupants = () => {
    switch (totalOccupants) {
      case '1 person':
        return 1;
      case '2 person':
        return 2;
      case '3 person':
        return 3;
      default:
        return 0;
    }
  };

  const numberOfOccupants = getNumberOfOccupants();

  const handleTotalOccupantsChange = (option) => {
    setTotalOccupants(option);
    if (option === 'None') {
      setOccupantData([
        { name: '', age: '', profession: '', about: '' },
        { name: '', age: '', profession: '', about: '' },
        { name: '', age: '', profession: '', about: '' },
      ]);
    }
  };

  useEffect(() => {
    const validateOccupantData = () => {
      if (totalOccupants === 'None') {
        return true;
      }

      for (let i = 0; i < numberOfOccupants; i++) {
        if (
          !occupantData[i]?.name ||
          !occupantData[i]?.age ||
          !occupantData[i]?.profession
        ) {
          return false;
        }
      }

      return true;
    };

    const isValid = validateOccupantData();
    onOccupantDataChange(isValid);
  }, [totalOccupants, occupantData, numberOfOccupants, onOccupantDataChange]);

  return (
    <Card className='w-full my-3 mx-auto'>
      <CardHeader>
        <CardTitle className='text-[#646464] font-normal'>
          Current Occupants Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div>
            <Label htmlFor='totalOccupants'>Total Occupants*</Label>
            <div className='flex space-x-2 mt-2'>
              {occupantOptions.map((option) => (
                <button
                  key={option}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    totalOccupants === option
                      ? 'bg-[#bfd7fe] text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                  onClick={() => handleTotalOccupantsChange(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {numberOfOccupants > 0 && (
            <div>
              {Array.from({ length: numberOfOccupants }).map((_, index) => (
                <div key={index} className='mb-4'>
                  <h3 className='text-lg font-semibold'>Person {index + 1}</h3>

                  <div>
                    <Label htmlFor={`name-${index}`}>
                      Name<span className='text-red-600'>*</span>
                    </Label>
                    <Input
                      id={`name-${index}`}
                      name='name'
                      className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                      placeholder='Full Name'
                      value={occupantData[index]?.name || ''}
                      onChange={(e) => handleOccupantChange(index, e)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`age-${index}`}>
                      Age<span className='text-red-600'>*</span>
                    </Label>
                    <div className='flex items-center space-x-2'>
                      <Input
                        id={`age-${index}`}
                        name='age'
                        placeholder='Age'
                        type='number'
                        min='0'
                        className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                        value={occupantData[index]?.age || ''}
                        onChange={(e) => handleAgeChange(index, e)}
                      />
                      <Label htmlFor={`age-${index}`} className='text-sm'>
                        Years
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`profession-${index}`}>
                      Profession<span className='text-red-600'>*</span>
                    </Label>
                    <Input
                      id={`profession-${index}`}
                      name='profession'
                      placeholder='Profession'
                      className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                      value={occupantData[index]?.profession || ''}
                      onChange={(e) => handleOccupantChange(index, e)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`about-${index}`}>About</Label>
                    <Textarea
                      id={`about-${index}`}
                      name='about'
                      placeholder='About'
                      className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                      value={occupantData[index]?.about || ''}
                      onChange={(e) => handleOccupantChange(index, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentOccupantsProfile;
