'use client';

import { useState } from 'react';

import FileUploader from '@/components/AddListings/FileUploader';
import PropertyDetailsForm from '@/components/AddListings/PropertyDetailsForm';
import PropertyLocation from '@/components/AddListings/PropertyLocation';
import Review from '@/components/AddListings/Review';
import ProgressBar from '@/components/ProgressBar';
import VerticalProgressBar from '@/components/VerticalProgressBar';

import { AddListingsProps } from '@/interfaces/PropsInterface';

const AddListings = ({
  page,
  setActiveTab,
  setIsDialogOpen,
}: AddListingsProps) => {
  const ProgressBarCheckpoints =
    page === 'edit'
      ? [
          {
            label: 'Property Details',
            placement: 1,
          },
          {
            label: 'Photos',
            placement: 2,
          },
        ]
      : [
          {
            label: 'Property Details',
            placement: 1,
          },
          {
            label: 'Address & Photos',
            placement: 2,
          },
          // {
          //   label: 'Photos',
          //   placement: 3,
          // },
          // {
          //   label: 'Verify',
          //   placement: 4,
          // },
          {
            label: 'Review',
            placement: 3,
          },
        ];
  const [currentPage, setCurrentPage] = useState(1);
  const steps =
    page === 'edit'
      ? ['Property Details', 'Photos']
      : ['Property Details', 'Address & Photos', 'Review'];
  const totalPages = 6;

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
    }
  };

  const handleBack = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
    }
  };
  return (
    <div>
      {page === 'edit' ? (
        <div className='container max-w-4xl mx-auto py-8'>
          <h1 className='text-3xl font-bold tracking-tight'>Edit Property</h1>
          <p className='mt-4 text-sm'>Application Step {currentPage} of 5</p>
        </div>
      ) : (
        <div className='container max-w-4xl mx-auto py-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Add New Property
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className='mt-4 text-sm'>Application Step {currentPage} of 5</p>
        </div>
      )}

      <div className='md:flex md:space-x-8'>
        {/* Progress Bar */}
        <div className='md:w-1/4 w-full px-1 md:mb-0 mb-4 py-1 md:py-8 md:px-4 md:h-[350px] mx-auto md:border border-gray-200 rounded-lg md:sticky md:top-4'>
          <VerticalProgressBar
            page={page || ''}
            currentpage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            checkpoints={ProgressBarCheckpoints}
          />
          <ProgressBar
            page={page || ''}
            currentpage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            checkpoints={ProgressBarCheckpoints}
          />
        </div>

        {/* Content */}
        <div className='md:w-3/4 w-full'>
          {currentPage === 1 && (
            <PropertyDetailsForm
              handleNext={handleNext}
              handleBack={handleBack}
              page={page}
            />
          )}
          {page !== 'edit' && currentPage === 2 && (
            <PropertyLocation
              handleNext={handleNext}
              handleBack={handleBack}
              page={page}
              setIsDialogOpen={setIsDialogOpen}
            />
          )}
          {page === 'edit' && currentPage === 2 && (
            <FileUploader
              handleNext={handleNext}
              handleBack={handleBack}
              page={page}
              setIsDialogOpen={setIsDialogOpen}
            />
          )}
          {/* {page !== 'edit' && currentPage === 4 && (
            <VerificationForm handleNext={handleNext} handleBack={handleBack} />
          )} */}
          {page !== 'edit' && currentPage === 3 && (
            <Review
              handleBack={handleBack}
              page={page}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddListings;
