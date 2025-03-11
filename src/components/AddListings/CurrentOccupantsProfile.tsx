import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  updateAddPropertyDetails,
  updateEditPropertyDetails,
} from '@/redux/slices/formslices';
import { RootState } from '@/redux/store';

interface CurrentOccupantsProfileProps {
  onOccupantDataChange: (isValid: boolean) => void;
  page?: string;
}

const CurrentOccupantsProfile = ({
  page,
  onOccupantDataChange,
}: CurrentOccupantsProfileProps) => {
  const dispatch = useDispatch();
  const addFormState = useSelector((state: RootState) => state.addForm);
  const editFormState = useSelector((state: RootState) => state.editForm);
  const isEditing = editFormState.isEditing;

  const [currentTab, setCurrentTab] = useState(0);

  const occupantData =
    page !== 'edit'
      ? addFormState.propertyDetails.occupantData
      : editFormState.propertyDetails.occupantData;

  useEffect(() => {
    if (occupantData.length === 0) {
      const initialOccupant = {
        name: '',
        age: 0,
        profession: '',
        about: '',
        gender: 'OTHER', // Default gender is 'OTHER'
      };

      if (page !== 'edit') {
        dispatch(
          updateAddPropertyDetails({
            occupantData: [initialOccupant],
          })
        );
      } else {
        dispatch(
          updateEditPropertyDetails({
            occupantData: [initialOccupant],
          })
        );
      }
    }
  }, [occupantData, page, dispatch]);

  const handleOccupantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOccupantData = [...occupantData];
    if (name === 'age') {
      updatedOccupantData[index] = {
        ...updatedOccupantData[index],
        [name]: Number(value),
      };
    } else {
      updatedOccupantData[index] = {
        ...updatedOccupantData[index],
        [name]: value,
      };
    }

    if (page !== 'edit') {
      dispatch(
        updateAddPropertyDetails({
          occupantData: updatedOccupantData,
        })
      );
    } else {
      dispatch(
        updateEditPropertyDetails({
          occupantData: updatedOccupantData,
        })
      );
    }
  };

  const handleAddOccupant = () => {
    if (occupantData.length < 10) {
      const newOccupant = {
        name: '',
        age: 0,
        profession: '',
        about: '',
        gender: 'OTHER',
      };

      const updatedOccupantData = [...occupantData, newOccupant];

      if (page !== 'edit') {
        dispatch(
          updateAddPropertyDetails({
            occupantData: updatedOccupantData,
          })
        );
      } else {
        dispatch(
          updateEditPropertyDetails({
            occupantData: updatedOccupantData,
          })
        );
      }

      setCurrentTab(occupantData.length);
    }
  };

  const handleRemoveOccupant = (index) => {
    if (occupantData.length > 1) {
      const updatedOccupantData = occupantData.filter(
        (_, tabIndex) => tabIndex !== index
      );

      if (page !== 'edit') {
        dispatch(
          updateAddPropertyDetails({
            occupantData: updatedOccupantData,
          })
        );
      } else {
        dispatch(
          updateEditPropertyDetails({
            occupantData: updatedOccupantData,
          })
        );
      }

      if (currentTab >= index) {
        setCurrentTab(currentTab - 1);
      }
    }
  };

  useEffect(() => {
    const validateOccupantData = () => {
      for (let i = 0; i < occupantData.length; i++) {
        if (
          !occupantData[i]?.name ||
          occupantData[i].age === 0 ||
          !occupantData[i]?.profession
        ) {
          return false;
        }
      }
      return true;
    };

    const isValid = validateOccupantData();
    onOccupantDataChange(isValid);
  }, [occupantData, onOccupantDataChange]);

  return (
    <Card className='w-full my-3 mx-auto'>
      <CardHeader>
        <div className='flex space-x-4'>
          {occupantData.map((_, index) => (
            <button
              key={index}
              className={`text-sm font-medium ${
                currentTab === index
                  ? 'bg-[#bfd7fe] text-primary-foreground'
                  : 'text-[#646464] hover:text-[#000]'
              } px-4 py-2 rounded-md`}
              onClick={() => setCurrentTab(index)}
            >
              Person {index + 1}
            </button>
          ))}
          {occupantData.length < 10 && (
            <button
              className='bg-[#bfd7fe] text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
              onClick={handleAddOccupant}
            >
              Add New Occupant
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className='text-lg font-semibold'>Person {currentTab + 1}</h3>

          <div>
            <Label htmlFor={`name-${currentTab}`}>
              Name<span className='text-red-600'>*</span>
            </Label>
            <Input
              id={`name-${currentTab}`}
              name='name'
              className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
              placeholder='Full Name'
              value={occupantData[currentTab]?.name || ''}
              onChange={(e) => handleOccupantChange(currentTab, e)}
            />
          </div>

          <div>
            <Label htmlFor={`age-${currentTab}`}>
              Age<span className='text-red-600'>*</span>
            </Label>
            <div className='flex items-center space-x-2'>
              <Input
                id={`age-${currentTab}`}
                name='age'
                placeholder='Age'
                type='number'
                min='0'
                className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
                value={occupantData[currentTab]?.age || ''}
                onChange={(e) => handleOccupantChange(currentTab, e)}
              />
              <Label htmlFor={`age-${currentTab}`} className='text-sm'>
                Years
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor={`profession-${currentTab}`}>
              Profession<span className='text-red-600'>*</span>
            </Label>
            <Input
              id={`profession-${currentTab}`}
              name='profession'
              placeholder='Profession'
              className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
              value={occupantData[currentTab]?.profession || ''}
              onChange={(e) => handleOccupantChange(currentTab, e)}
            />
          </div>

          {/* <div>
            <Label className='text-md text-black font-normal'>
              Preferred Gender
            </Label>
            <Input
              id={`gender-${currentTab}`}
              name='gender'
              value='OTHER'
              disabled
              className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
            />
          </div> */}

          <div>
            <Label htmlFor={`about-${currentTab}`}>About</Label>
            <Textarea
              id={`about-${currentTab}`}
              name='about'
              placeholder='About'
              className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
              value={occupantData[currentTab]?.about || ''}
              onChange={(e) => handleOccupantChange(currentTab, e)}
            />
          </div>

          {currentTab > 0 && (
            <button
              className='text-red-600 hover:text-red-800 mt-2'
              onClick={() => handleRemoveOccupant(currentTab)}
            >
              Remove
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentOccupantsProfile;
