import Image from 'next/image';
import React, { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { ImageGalleryprops } from '@/interfaces/PropsInterface';

const galleryImages = [
  {
    className: 'object-cover rounded-t-xl sm:rounded-t-none sm:rounded-l-xl',
  },
  {
    className: 'object-cover',
  },
  {
    className: 'object-cover sm:rounded-tr-xl',
  },
  {
    className: 'object-cover',
  },
  {
    className: 'object-cover rounded-b-xl sm:rounded-b-none sm:rounded-br-xl',
  },
];

const FullGallery = ({ images, title, mainImage }) => (
  <div className='flex flex-col gap-4'>
    {/* Main Image */}
    {/* <div className='relative aspect-[16/9] w-full'>
      <Image
        src={mainImage || '/svg/no-results.svg'}
        alt={`${title} - Main Image`}
        layout='fill'
        objectFit='cover'
        className='rounded-lg'
      />
    </div> */}

    {/* Grid of Other Images */}
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
      {images.map((image, index) => (
        <div key={index} className='relative aspect-square'>
          <Image
            src={image}
            alt={`${title} - Image ${index + 1}`}
            layout='fill'
            objectFit='cover'
            className='rounded-lg transition-transform hover:scale-105'
          />
        </div>
      ))}
    </div>
  </div>
);

const blurWidth = 100;

const ImageGallery = ({ propertyData }: ImageGalleryprops) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <div className='flex flex-col gap-4 w-full'>
        {/* Main Image */}
        <Card className='overflow-hidden rounded-lg border-0'>
          <CardContent className='p-0'>
            <div className='relative w-full h-48 sm:h-[32rem]'>
              <Image
                src={propertyData.mainImage || '/svg/no-results.svg'}
                alt={propertyData.title}
                layout='fill'
                objectFit='cover'
                quality={100}
                className={galleryImages[0].className}
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Other Images in Scrollable Container */}
        <div className=' relative z-0 '>
          <div className='relative flex overflow-x-scroll gap-4'>
            {propertyData.photos.map((image, index) => (
              <div key={index} className='relative w-36 h-36 aspect-square'>
                <Image
                  src={image || '/svg/no-results.svg'}
                  alt={`${propertyData.title} - Image ${index + 1}`}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-lg'
                />
              </div>
            ))}
          </div>

          <div
            className='absolute right-0 top-0 h-full bg-gradient-to-l from-white to-transparent z-10'
            style={{ width: `${blurWidth}px`, pointerEvents: 'none' }}
          />
        </div>

        {/* Show All Photos Button */}
        {/* <Button
          variant='secondary'
          size='sm'
          className='flex items-center gap-1 sm:gap-2 bg-white/90 hover:bg-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2'
          onClick={() => setIsGalleryOpen(true)}
        >
          <ImageIcon className='w-3 h-3 sm:w-4 sm:h-4' />
          <span className='font-semibold'>Show all photos</span>
        </Button> */}
      </div>

      {/* <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className='max-w-7xl w-11/12 h-[90vh] overflow-y-auto'>
          <DialogTitle className='text-2xl font-bold mb-4'>
            All Photos
          </DialogTitle>
          <FullGallery
            images={propertyData.photos}
            title={propertyData.title}
            mainImage={propertyData.mainImage}
          />
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default ImageGallery;
