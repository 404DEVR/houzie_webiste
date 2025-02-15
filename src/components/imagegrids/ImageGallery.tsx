import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const galleryImages = [
  {
    id: 1,
    src: '/images/3d-electric-car-building-1.png',
    alt: 'Modern building with electric car charging station',
    className: 'object-cover rounded-t-xl sm:rounded-t-none sm:rounded-l-xl',
  },
  {
    id: 2,
    src: '/images/armchair-green-living-room-with-copy-space-1.png',
    alt: 'Green armchair in living room',
    className: 'object-cover',
  },
  {
    id: 3,
    src: '/images/luxury-classic-modern-bedroom-suite-hotel-1.png',
    alt: 'Luxury hotel bedroom suite',
    className: 'object-cover sm:rounded-tr-xl',
  },
  {
    id: 4,
    src: '/images/3d-rendering-loft-luxury-living-room-with-bookshelf-1.png',
    alt: 'Modern living room with bookshelf',
    className: 'object-cover',
  },
  {
    id: 5,
    src: '/images/empty-modern-room-with-furniture-1.png',
    alt: 'Modern living room',
    className: 'object-cover rounded-b-xl sm:rounded-b-none sm:rounded-br-xl',
  },
];

const ImageGallery = () => {
  return (
    <div className='flex flex-col sm:flex-row gap-2 sm:gap-2.5 mt-4 sm:mt-7'>\
      <Card className='flex-1 overflow-hidden sm:rounded-l-xl sm:rounded-r-none border-0'>
        <CardContent className='p-0'>
          <div className='relative w-full h-48 sm:h-56 md:h-[34.8rem]'>
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
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
        {galleryImages.slice(1).map((image, index) => (
          <Card
            key={image.id}
            className={`relative overflow-hidden border-0 ${
              index === 1
                ? 'sm:rounded-tr-xl'
                : index === 3
                ? 'sm:rounded-br-xl'
                : ''
            }`}
          >
            <CardContent className='p-0'>
              <div className='relative w-full h-24 sm:h-[27vh] md:h-[17rem]'>
                <Image
                  src={image.src}
                  alt={image.alt}
                  layout='fill'
                  objectFit='cover'
                  quality={100}
                  className={image.className}
                />
              </div>
              {index === 3 && (
                <div className='absolute bottom-2 right-2 sm:bottom-4 sm:right-4'>
                  <Button
                    variant='secondary'
                    size='sm'
                    className='flex items-center gap-1 sm:gap-2 bg-white/90 hover:bg-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2'
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
  );
};

export default ImageGallery;
