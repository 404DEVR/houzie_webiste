'use client';

import { useState, useEffect } from 'react';

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
          {
            label: 'Review',
            placement: 3,
          },
        ];

  const [currentPage, setCurrentPage] = useState(1);
  const [headerHeight, setHeaderHeight] = useState(0);

  const steps =
    page === 'edit'
      ? ['Property Details', 'Photos']
      : ['Property Details', 'Address & Photos', 'Review'];
  const totalPages = 3;

  useEffect(() => {
    // Dynamically calculate the height of the right-side content
    const headerElement = document.querySelector(
      '.right-content'
    ) as HTMLElement | null;
    if (headerElement) {
      const height = headerElement.offsetHeight;
      setHeaderHeight(height);
    }
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
    }
  };

  const getTitle = (page: number) => {
    switch (page) {
      case 1:
        return 'Add New Property';
      case 2:
        return 'Location And Gallery';
      case 3:
        return 'Review Details';
      default:
        return '';
    }
  };

  const getDescription = (page: number) => {
    switch (page) {
      case 1:
        return "To help your property reach the right tenants, please fill in the details below. The more accurate and detailed the information, the better we can match your property with potential renters. From basic information to amenities and pricing, every detail matters in making your listing stand out. Let's get started!";
      case 2:
        return 'Help renters discover your property by providing its exact location and uploading high-quality images. The location will make your listing more accessible, while clear, appealing pictures can attract more interest. Make sure to highlight the best features of your property through visuals to leave a lasting impression.';
      case 3:
        return "Add your properties to our platform and reach a vast audience of potential buyers and renters. Our user-friendly interface allows you to easily list your properties with detailed descriptions, high-quality photos, and virtual tours. By showcasing your listings here, you'll increase visibility, streamline client interactions, and grow your business efficiently. Start adding your properties today!";
      default:
        return '';
    }
  };

  return (
    <div className='md:flex md:space-x-8'>
      {page === 'edit' ? (
        <div className='container md:hidden max-w-4xl mx-auto py-8'>
          <h1 className='text-3xl font-bold tracking-tight'>Edit Property</h1>
          <p className='mt-4 text-sm'>Application Step {currentPage} of 5</p>
        </div>
      ) : (
        <div className='container md:hidden max-w-4xl mx-auto py-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {getTitle(currentPage)}
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            {getDescription(currentPage)}
          </p>
          <p className='mt-4 text-sm'>Application Step {currentPage} of 3</p>
        </div>
      )}
      {/* Left Side Content */}
      <div
        style={{ marginTop: `${headerHeight}px` }}
        className='md:w-1/4 w-full hidden md:block px-1 md:mb-0 mb-4 py-1 md:py-8 md:px-4 md:h-[350px] mx-auto md:border border-gray-200 rounded-lg md:sticky md:top-4'
      >
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
      <div className='md:w-1/4 w-full md:hidden px-1 md:mb-0 mb-4 py-1 md:py-8 md:px-4 md:h-[350px] mx-auto md:border border-gray-200 rounded-lg md:sticky md:top-4'>
        <ProgressBar
          page={page || ''}
          currentpage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          checkpoints={ProgressBarCheckpoints}
        />
      </div>

      {/* Right Side Content */}
      <div className='md:w-3/4 w-full'>
        {page === 'edit' ? (
          <div className='container hidden md:block max-w-4xl mx-auto py-8 right-content'>
            <h1 className='text-3xl font-bold tracking-tight'>Edit Property</h1>
            <p className='mt-4 text-sm'>Application Step {currentPage} of 5</p>
          </div>
        ) : (
          <div className='container hidden md:block max-w-4xl mx-auto py-8 right-content'>
            <h1 className='text-3xl font-bold tracking-tight'>
              {getTitle(currentPage)}
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              {getDescription(currentPage)}
            </p>
            <p className='mt-4 text-sm'>Application Step {currentPage} of 3</p>
          </div>
        )}
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
        {page !== 'edit' && currentPage === 3 && (
          <Review
            handleBack={handleBack}
            page={page}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

export default AddListings;
