import { Bath, Bed, Building2, Home, Lock, Wallet } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { Listing, PropertyFeature } from '@/interfaces/Interface';
import { PropertyReviewProps } from '@/interfaces/PropsInterface';

const transformString = (str: string | null | undefined) => {
  if (!str) return '';
  // Replace underscores with spaces and convert to title case
  return toTitleCase(str.replace(/_/g, ' '));
};

const toTitleCase = (str: string | null | undefined) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const PropertyReview: React.FC<PropertyReviewProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  if (!data || Object.keys(data).length === 0) {
    return <p>No property data available for review.</p>;
  }

  const getPropertyFeatures = (listing: Listing): PropertyFeature[] => {
    const features: PropertyFeature[] = [];
    if (listing.bedrooms) {
      features.push({ icon: Bed, label: `${listing.bedrooms} Beds` });
    }
    if (listing.bathrooms) {
      features.push({ icon: Bath, label: `${listing.bathrooms} Baths` });
    }
    if (listing.balconies) {
      features.push({
        icon: Building2,
        label: `${listing.balconies} Balconies`,
      });
    }
    features.push({
      icon: Home,
      label: transformString(listing.propertyType),
    });

    return features;
  };
  const propertyFeatures = [
    data.bedrooms !== 0 && { icon: Bed, label: `${data.bedrooms} Beds` },
    data.bathrooms !== 0 && { icon: Bath, label: `${data.bathrooms} Baths` },
    data.propertyType && {
      icon: Home,
      label: transformString(data.propertyType),
    },
  ].filter(Boolean);

  const financialDetails = [
    data.price && {
      icon: Wallet,
      label: 'Rent',
      amount: `₹${data.price}`,
    },
    data.security && {
      icon: Lock,
      label: 'Security Deposit',
      amount: `₹${data.security}`,
    },
  ].filter(Boolean);

  const imageSRC =
    data.mainImage ||
    (data.photos && data.photos[0]) ||
    '/placeholder-image.jpg';

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  return (
    <Card
      key={data.id}
      className='shadow-md rounded-2xl bg-[#eff6ff] border transition-all duration-300 overflow-hidden'
    >
      <CardContent className='p-2 flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-[350px] h-[180px] flex items-center justify-center'>
          <div className='relative w-full h-full'>
            <Image
              src={data.mainImage || '/svg/no-results.svg'}
              alt={data.title}
              fill
              className='object-cover rounded-2xl'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        </div>

        <div className='w-full flex flex-col md:flex-row'>
          <div className='md:w-[70%] pt-4 md:pt-6'>
            <div className='flex flex-col justify-between items-center md:items-start mb-6'>
              <h2 className='text-base sm:text-xl font-semibold mb-2'>
                {data.title}
              </h2>
              <h3 className='text-xs font-normal line-clamp-2 w-[90%] text-center md:text-start'>
                {data.description}
              </h3>
            </div>

            {getPropertyFeatures(data).length > 0 && (
              <div className='flex flex-wrap items-center md:items-start justify-center md:justify-start mt-2 mb-4 md:mb-0'>
                {getPropertyFeatures(data).map((feature, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className=' border-none flex gap-1 justify-center items-center'
                  >
                    <feature.icon className='w-[14px] h-[14px]' />
                    <span className='font-medium text-xs'>{feature.label}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className='flex flex-col justify-center items-center p-2 md:items-start '>
            <div className='flex gap-6 mb-2 flex-wrap md:flex-nowrap '>
              <div className='mb-1'>
                <p className='text-gray-500 text-xs'>Rent</p>
                <span className='text-black text-2xl font-semibold flex gap-2'>
                  <span>₹</span> {data.price}
                </span>
              </div>
              <div className='mb-1'>
                <p className='text-gray-500 text-xs'>Location:</p>
                <span className='text-black text-2xl font-semibold'>
                  {data.location.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
