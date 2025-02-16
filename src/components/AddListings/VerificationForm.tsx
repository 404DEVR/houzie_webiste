import Image from 'next/image';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib/utils';

import CustomInput from '@/components/inputs/CustomInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  restructureAddFormData,
  updateAddVerification,
} from '@/redux/slices/formslices';
import { RootState } from '@/redux/store';

interface VerificationFormprops {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
}

const VerificationForm = ({
  handleNext,
  handleBack,
}: VerificationFormprops) => {
  const dispatch = useDispatch();
  const verification = useSelector(
    (state: RootState) => state.addForm.verification
  );

  const formData = useSelector((state: RootState) => state.addForm);

  const handleDateChange = (date: Date | undefined) => {
    dispatch(
      updateAddVerification({ selectedDate: date?.toISOString() || null })
    );
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateAddVerification({ phoneNumber: e.target.value }));
  };

  useEffect(() => {
    // Set initial date if not already set
    if (!verification.selectedDate) {
      dispatch(
        updateAddVerification({ selectedDate: new Date().toISOString() })
      );
    }
  }, [dispatch, verification.selectedDate]);

  const handleSubmit = () => {
    dispatch(restructureAddFormData());
    handleNext();
  };

  return (
    <Card className='rounded-xl md:p-8 shadow-sm max-w-4xl my-6 mx-auto border border-gray-200'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold '>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='border bg-[#F1F1F1] border-gray-200 border-dashed p-4 rounded-xl'>
          {/* Steps Section */}
          <div className='flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 mb-8'>
            {/* Step 1 */}
            <div className='flex flex-col items-center text-center'>
              <Image
                src='/svg/first.svg'
                alt='Visit Property'
                width={80}
                height={80}
                className='mb-2 md:w-[100px] md:h-[100px]'
              />
              <p className='text-sm text-black'>Visit the property</p>
            </div>

            {/* Arrow */}
            <div className='hidden md:block text-[#42a4ae] text-5xl'>→</div>

            {/* Step 2 */}
            <div className='flex flex-col items-center text-center'>
              <Image
                src='/svg/second.svg'
                alt='Open Link'
                width={80}
                height={80}
                className='mb-2 md:w-[100px] md:h-[100px]'
              />
              <p className='text-sm text-black'>
                Open link shared on your phone
              </p>
            </div>

            {/* Arrow */}
            <div className='hidden md:block text-[#42a4ae] text-5xl'>→</div>

            {/* Step 3 */}
            <div className='flex flex-col items-center text-center'>
              <Image
                src='/svg/third.svg'
                alt='Click Photo'
                width={80}
                height={80}
                className='mb-2 md:w-[100px] md:h-[100px]'
              />
              <p className='text-sm text-black'>Click photo & submit</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Visit Property Section */}
            <div className='bg-white rounded-xl p-4 border border-gray-200'>
              <h3 className='text-sm font-medium mb-2 text-center'>
                I will visit the Property
              </h3>
              <div className='flex flex-col'>
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'block w-full relative sm:text-sm border-t-0 rounded-none border-x-0 border-b-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                        !verification.selectedDate && 'text-muted-foreground'
                      )}
                    >
                      {/* {!isFocused && (
                        <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none text-sm text-gray-600'>
                          <span>Pick a date</span>
                          <span className='text-red-500'>*</span>
                        </div>
                      )} */}

                      {verification.selectedDate ? (
                        new Date(verification.selectedDate).toLocaleDateString()
                      ) : (
                        <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none text-sm text-gray-600'>
                          <span>Pick a date</span>
                          <span className='text-red-500'>*</span>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='center'
                    sideOffset={10}
                  >
                    <Calendar
                      mode='single'
                      // Convert ISO string to Date object for the Calendar component
                      selected={
                        verification.selectedDate
                          ? new Date(verification.selectedDate)
                          : undefined
                      }
                      onSelect={handleDateChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Set Reminder Button */}
                <Button
                  variant='outline'
                  className='border-2 border-[#42A4AE] text-[#42A4AE] mt-6 w-full md:w-[70%] mx-auto'
                >
                  Set Reminder
                </Button>
              </div>
            </div>

            {/* Share Link Section */}
            <div className='bg-white rounded-xl px-4 pt-4 border border-gray-200'>
              <h3 className='text-sm font-medium mb-2 text-center'>
                Share link with someone else
              </h3>
              <div className='flex flex-col'>
                {/* Phone Number Input */}
                <CustomInput
                  type='tel'
                  name='phone-number'
                  id='phone-number'
                  value={verification.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder='Enter phone number*'
                  required
                />

                {/* Share Link Button */}
                <Button
                  variant='outline'
                  className='border-2 border-[#42A4AE] text-[#42A4AE] mt-6 w-full md:w-[70%] mx-auto'
                >
                  Share Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex flex-col-reverse gap-y-4 md:flex-row justify-end items-center gap-x-4 mt-6'>
        <Button
          onClick={handleBack}
          variant='outline'
          className='border-2 border-[#42A4AE] text-[#42A4AE] w-full md:w-auto'
        >
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          className='bg-[#42A4AE] text-white px-6 py-3 rounded-lg w-full md:w-auto'
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerificationForm;
