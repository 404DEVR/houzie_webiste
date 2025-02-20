// Review.tsx (Modified)
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

import { resetAddForm } from '@/redux/slices/formslices';
import { RootState } from '@/redux/store';

interface ReviewProps {
  handleBack: () => void;
  page?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

const Review = ({ handleBack, setActiveTab }: ReviewProps) => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const restructuredData = useSelector(
    (state: RootState) => state.addForm.restructuredData
  );

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
    } catch (error: any) {
      if (
        error.response?.status === 401 ||
        error.message === 'No access token available'
      ) {
        toast({
          title: 'Session expired. Please log in again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title:
            'Unable to publish listing at this moment. Please try again later',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card className='rounded-xl md:p-8 shadow-sm max-w-4xl my-6 mx-auto border border-gray-200'>
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
          className='border-2 border-[#42A4AE] text-[#42A4AE] w-full md:w-auto'
        >
          Back
        </Button>
        <Button
          onClick={handlePost}
          className='bg-[#42A4AE] text-white px-4 font-normal py-4 rounded-lg'
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Review;
