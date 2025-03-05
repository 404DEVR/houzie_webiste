import api from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import { PropertyReview } from '@/components/AddListings/PropertyReview';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ReviewProps } from '@/interfaces/PropsInterface';
import { resetAddForm } from '@/redux/slices/formslices';
import { RootState } from '@/redux/store';

const Review = ({ handleBack, setActiveTab }: ReviewProps) => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const restructuredData = useSelector(
    (state: RootState) => state.addForm.restructuredData
  );

  console.log(restructuredData);

  const handlePost = async () => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await api.post('https://api.houzie.in/listings', restructuredData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast({
        title: 'Listing Posted Successfully',
      });
      dispatch(resetAddForm());

      if (setActiveTab) {
        setActiveTab('myListing');
      }
    } catch {
      toast({
        title: 'Session expired. Please log in again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className='rounded-xl md:p-8 shadow-sm max-w-4xl my-6 md:my-0 mx-auto border border-gray-200'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='w-full pr-4'>
          {restructuredData && Object.keys(restructuredData).length > 0 ? (
            <PropertyReview data={restructuredData} />
          ) : (
            <p>No property data available for review.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex justify-end items-center gap-4'>
        <Button
          onClick={handleBack}
          variant='outline'
          className='bg-[#f5f5fa] text-[#f66659] hover:bg-[#f66659] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
        >
          Back
        </Button>
        <Button
          onClick={handlePost}
          className='bg-[#f5f5fa] text-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Review;
