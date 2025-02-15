// components/PropertySuggestions.tsx
import { Heart } from 'lucide-react';
import { Bath, Bed, Building2, Home } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const properties = [
  {
    id: 1,
    title: 'Seaside Serenity Villa',
    description:
      'A stunning 4-bedroom, 3-bathroom villa in a peaceful suburban neighborhood...',
    image: '/images/armchair-green-living-room-with-copy-space-1.png',
    propertyFeatures: [
      { icon: Bed, label: '4-Bedroom' },
      { icon: Bath, label: '3-Bathroom' },
      { icon: Building2, label: 'Balcony' },
      { icon: Home, label: 'Villa' },
    ],
    price: '65.5',
  },
  {
    id: 2,
    title: 'Rustic Retreat Commercial',
    description:
      'A stunning 4-bedroom, 3-bathroom villa in a peaceful suburban neighborhood...',
    image: '/images/luxury-classic-modern-bedroom-suite-hotel-1.png',
    propertyFeatures: [
      { icon: Bed, label: '4-Bedroom' },
      { icon: Bath, label: '3-Bathroom' },
      { icon: Building2, label: 'Balcony' },
      { icon: Home, label: 'Villa' },
    ],
    price: '65.5',
  },
  {
    id: 3,
    title: 'Metropolitan Haven',
    description:
      'A stunning 4-bedroom, 3-bathroom villa in a peaceful suburban neighborhood...',
    image: '/images/3d-rendering-loft-luxury-living-room-with-bookshelf-1.png',
    propertyFeatures: [
      { icon: Bed, label: '4-Bedroom' },
      { icon: Bath, label: '3-Bathroom' },
      { icon: Building2, label: 'Balcony' },
      { icon: Home, label: 'Villa' },
    ],
    price: '65.5',
  },
];

export default function PropertySuggestions() {
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  return (
    <div className='w-full max-w-[95%] md:max-w-[100%] mx-auto p-4 bg-white rounded-lg shadow-sm'>
      <h2 className='text-2xl font-semibold mb-4'>Other suggestion</h2>

      <div className='flex gap-12 overflow-x-auto scrollbar-hide px-4'>
        {properties.map((property) => (
          <Card
            key={property.id}
            className='min-w-[300px] max-w-[330px] flex flex-col border-none px-0'
          >
            <div className='relative'>
              <Image
                width={96}
                height={96}
                src={property.image}
                alt={property.title}
                className='w-full h-[220px] object-cover rounded-lg'
              />
              <button
                className='absolute top-2 right-2 p-1.5'
                onClick={() => toggleFavorite(property.id)}
              >
                <Heart
                  className='w-5 h-5 text-[#42A4AE]'
                  fill={favorites[property.id] ? '#42A4AE' : 'transparent'}
                />
              </button>
            </div>

            <CardContent className='pt-4 px-0'>
              <h3 className='text-lg font-semibold mb-4'>{property.title}</h3>
              <p className='text-sm text-gray-600 mb-4'>
                {property.description}
                <button className='underline ml-1 text-black'>Read More</button>
              </p>

              <div className='flex gap-2 flex-wrap '>
                {property.propertyFeatures.map((feature, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='bg-[#191919] text-white border-neutral-800 px-[8px] py-[3px] rounded-[20.53px]'
                  >
                    <feature.icon className='w-[17.59px] h-[17.59px]' />
                    <span className='font-medium text-sm ml-[4px]'>
                      {feature.label}
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className='px-0 flex'>
              <div className='flex items-center justify-between flex-[1]'>
                <div>
                  <p className='text-sm text-gray-500'>Rent</p>
                  <p className='text-lg font-semibold'>
                    ₹ {property.price} lakh
                  </p>
                </div>
              </div>
              <Button className='w-full bg-teal-500 hover:bg-teal-600 flex-[1] text-white'>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
