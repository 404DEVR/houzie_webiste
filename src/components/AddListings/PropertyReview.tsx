import React, { useState } from 'react';
import Image from 'next/image';
import { Bath, Bed, Heart, Home, Lock, Wallet, MapPin, Calendar, User, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import AmenitiesDisplay from '@/components/AddListings/AmenitiesDisplay';

interface PropertyReviewProps {
  data: any;
}


export const PropertyReview: React.FC<PropertyReviewProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [favorites, setFavorites] = useState(false);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);
  const toggleFavorite = () => setFavorites((prev) => !prev);

  if (!data || Object.keys(data).length === 0) {
    return <p>No property data available for review.</p>;
  }


  const propertyFeatures = [
    { icon: Bed, label: `${data.bedrooms} Beds` },
    { icon: Bath, label: `${data.bathrooms} Baths` },
    { icon: Home, label: data.propertyType },
  ];

  const financialDetails = [
    {
      icon: Wallet,
      label: 'Rent',
      amount: `₹${data.price}`,
    },
    {
      icon: Lock,
      label: 'Security Deposit',
      amount: `₹${data.security}`,
    },
  ];

  const imageSRC = data.mainImage || (data.photos && data.photos[0]) || '/placeholder-image.jpg';

  return (
    <Card className="w-full mx-auto overflow-hidden shadow-2xl max-w-full">
      <div className='flex flex-col lg:flex-row'>
        <div className="w-full lg:w-[300px] h-[250px] mx-auto lg:mx-0 flex items-center justify-center p-4">
          <div className='relative w-full h-full'>
            <Image
              src={imageSRC}
              alt={data.title}
              fill
              className='object-cover rounded-md'
              sizes='(max-width: 640px) 100vw, 300px'
            />
            <button
              className='absolute top-3 right-3 p-2'
              onClick={toggleFavorite}
            >
              <Heart
                className='w-5 h-5 text-[#42A4AE]'
                fill={favorites ? '#42A4AE' : 'transparent'}
              />
            </button>
          </div>
        </div>

        <div className='flex-1 p-4'>
          <div className='space-y-4 h-full flex flex-col'>
            <div>
              <h3 className='text-center md:text-start text-xl font-semibold leading-tight'>
                {data.title}
              </h3>
              <div className="relative mt-2">
                <p
                  className={`text-sm text-gray-700 ${
                    isExpanded ? '' : 'line-clamp-2'
                  }`}
                >
                  {data.description || 'No description available.'}
                </p>
                <button
                  onClick={toggleExpanded}
                  className="text-blue-500 text-sm text-nowrap font-medium hover:underline"
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                </button>
              </div>
            </div>
            
            <div className='flex flex-wrap items-start justify-center md:justify-start gap-2'>
              {propertyFeatures.map((feature, index) => (
                <Badge
                  key={index}
                  variant='outline'
                  className='bg-[#191919] text-white border-neutral-800 px-[10.26px] py-[5.86px] rounded-[20.53px]'
                >
                  {feature.icon && <feature.icon className='w-[17.59px] h-[17.59px]' />}
                  <span className='font-medium text-sm ml-[2.93px]'>
                    {feature.label}
                  </span>
                </Badge>
              ))}
            </div>
            <div className='flex flex-wrap items-start mx-auto md:mx-0 gap-2 max-w-2xl'>
              {financialDetails.map((detail, index) => (
                <Card key={index} className='border-[#eaebef] flex-[1]'>
                  <CardContent className='flex items-center gap-[1.47px] p-1.5'>
                    {detail.icon && <detail.icon className='w-[17.59px] h-[17.59px]' />}
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
          </div>
        </div>
      </div>
      
      <div className='p-4 space-y-4'>
        <div>
          <h4 className='font-semibold'>Location</h4>
          <p className='flex items-center'>
            <MapPin className='w-4 h-4 mr-2' />
            {data.location.city}, {data.location.state}, {data.location.country}
          </p>
        </div>
        
        <div>
          <h4 className='font-semibold'>Property Details</h4>
          <p>Configuration: {data.configuration}</p>
          <p>Floor: {data.floorNumber} of {data.totalFloors}</p>
          <p>Balconies: {data.balconies}</p>
          <p>Room Size: {data.roomSize} sq ft</p>
          <p>Furnishing: {data.furnishing}</p>
          <p>Sharing Type: {data.sharingType}</p>
          <p>Units Available: {data.unitsAvailable}</p>
        </div>
        
        <div>
          <h4 className='font-semibold'>Financial Details</h4>
          <p>Brokerage: ₹{data.brokerage} {data.isNegotiable ? '(Negotiable)' : ''}</p>
          <p>Lock-in Period: {data.lockInPeriod}</p>
          <p>Maintenance: ₹{data.maintenanceCharges} {data.isMaintenanceIncluded ? '(Included)' : '(Not Included)'}</p>
        </div>
        
        <div>
          <h4 className='font-semibold'>Additional Information</h4>
          <p className='flex items-center'>
            <Calendar className='w-4 h-4 mr-2' />
            Available From: {data.availableFrom}
          </p>
          <p className='flex items-center'>
            <User className='w-4 h-4 mr-2' />
            Preferred Tenant: {data.preferredTenant}
          </p>
        </div>
        
        <div>
          <h4 className='font-semibold'>Amenities</h4>
          <div className='flex flex-wrap gap-2'>
           <AmenitiesDisplay data={data.amenities} type='amenities' />
          </div>
        </div>

        {/* <div>
          <h4 className='font-semibold'>Furnishings</h4>
          <div className='flex flex-wrap gap-2'>
           <AmenitiesDisplay data={data.furni} type='furnishing' />
          </div>
        </div> */}
      </div>
    </Card>
  );
};
