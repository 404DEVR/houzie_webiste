import { DialogTitle } from '@radix-ui/react-dialog';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
    <div className='relative aspect-[16/9] w-full'>
      <Image
        src={mainImage || '/svg/no-results.svg'}
        alt={`${title} - Main Image`}
        layout='fill'
        objectFit='cover'
        className='rounded-lg'
      />
    </div>

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

const ImageGallery = ({ propertyData }: ImageGalleryprops) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-2.5 mt-4 sm:mt-7'>
        <Card className='flex-1 overflow-hidden sm:rounded-xl border-0'>
          <CardContent className='p-0'>
            <div className='relative w-full h-48 sm:h-[34.8rem]'>
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
        <div className='grid grid-cols-2 gap-2 md:gap-2.5 flex-1'>
          {propertyData.photos.slice(0, 4).map((image, index) => (
            <Card key={index} className='relative overflow-hidden border-0'>
              <CardContent className='p-0'>
                <div className='relative w-full h-24 sm:h-[27vh] md:h-[17rem]'>
                  <Image
                    src={image || '/svg/no-results.svg'}
                    alt={`${propertyData.title} - Image ${index + 1}`}
                    layout='fill'
                    objectFit='cover'
                    quality={100}
                    className={galleryImages[index + 1].className}
                  />
                </div>
                {index === 3 && (
                  <div className='absolute bottom-2 right-2 sm:bottom-4 sm:right-4'>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='flex items-center gap-1 sm:gap-2 bg-white/90 hover:bg-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2'
                      onClick={() => setIsGalleryOpen(true)}
                    >
                      <ImageIcon className='w-3 h-3 sm:w-4 sm:h-4' />
                      <span className='font-semibold'>Show all photos</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
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
      </Dialog>
    </>
  );
};

export default ImageGallery;
