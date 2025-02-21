import {
  Bath,
  Bed,
  Building2,
  Home,
  Lock,
  Receipt,
  Wallet,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { PropertyHighlightsprops } from '@/interfaces/PropsInterface';

const transformString = (str: string | null | undefined) => {
  if (!str) return '';
  // Replace underscores with spaces and convert to title case
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function PropertyHighlights({
  propertyData,
}: PropertyHighlightsprops) {
  const propertyFeatures = [
    { icon: Bed, label: `${propertyData.bedrooms} Bedrooms` },
    { icon: Bath, label: `${propertyData.bathrooms} Bathrooms` },
    { icon: Building2, label: `${propertyData.balconies} Balconies` },
    { icon: Home, label: transformString(propertyData.propertyType) },
  ];

  const financialDetails = [
    { icon: Wallet, label: 'Rent', amount: `₹${propertyData.price}` },
    { icon: Lock, label: 'Security', amount: `₹${propertyData.security}` },
    { icon: Receipt, label: 'Brokerage', amount: `₹${propertyData.brokerage}` },
  ];

  return (
    <Card className='flex flex-col items-start gap-5 p-5'>
      <CardContent className='flex flex-col gap-[22px] w-full p-0'>
        <h2 className='font-semibold text-2xl leading-9'>Property Highlight</h2>
        <div className='flex flex-wrap items-start gap-2'>
          {propertyFeatures.map((feature, index) => (
            <Badge
              key={index}
              variant='outline'
              className='bg-[#191919] text-white border-neutral-800 px-[10.26px] py-[5.86px] rounded-[20.53px]'
            >
              <feature.icon className='w-[17.59px] h-[17.59px]' />
              <span className='font-medium text-sm ml-[2.93px]'>
                {feature.label}
              </span>
            </Badge>
          ))}
        </div>

        <div className='flex flex-wrap items-start mx-0 gap-2 max-w-[70%] sm:max-w-[80%]'>
          {financialDetails.map((detail, index) => (
            <Card key={index} className='border-[#eaebef] flex-[1]'>
              <CardContent className='flex items-center gap-[1.47px] p-1.5'>
                <detail.icon className='w-6 h-6' />
                <div className='flex flex-col gap-px flex-1'>
                  <div className='text-[#4a4a4a] text-sm text-center font-medium'>
                    {detail.label}
                  </div>
                  <div className='text-black text-[15px] text-center font-semibold'>
                    {detail.amount}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
