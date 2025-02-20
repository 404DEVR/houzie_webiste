import {
  Bath,
  Bed,
  Calendar,
  Home,
  Lock,
  MapPin,
  User,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import AmenitiesDisplay from '@/components/AddListings/AmenitiesDisplay';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyReviewProps {
  data: any;
}

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

  return (
    <Card className='w-full mx-auto overflow-hidden shadow-2xl max-w-full'>
      <div className='flex flex-col lg:flex-row'>
        <div className='w-full lg:w-[300px] h-[250px] mx-auto lg:mx-0 flex items-center justify-center p-4'>
          <div className='relative w-full h-full'>
            <Image
              src={imageSRC}
              alt={data.title || 'Property Image'}
              fill
              className='object-cover rounded-md'
              sizes='(max-width: 640px) 100vw, 300px'
            />
          </div>
        </div>

        <div className='flex-1 p-4'>
          <div className='space-y-4 h-full flex flex-col'>
            <div>
              {data.title && (
                <h3 className='text-center md:text-start text-xl font-semibold leading-tight'>
                  {data.title}
                </h3>
              )}
              {data.description && (
                <div className='relative mt-2'>
                  <p
                    className={`text-sm text-gray-700 ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    {data.description}
                  </p>
                  <button
                    onClick={toggleExpanded}
                    className='text-blue-500 text-sm text-nowrap font-medium hover:underline'
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>
                </div>
              )}
            </div>

            <div className='flex flex-wrap items-start justify-center md:justify-start gap-2'>
              {propertyFeatures.map((feature, index) => (
                <Badge
                  key={index}
                  variant='outline'
                  className='bg-[#191919] text-white border-neutral-800 px-[10.26px] py-[5.86px] rounded-[20.53px]'
                >
                  {feature.icon && (
                    <feature.icon className='w-[17.59px] h-[17.59px]' />
                  )}
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
                    {detail.icon && (
                      <detail.icon className='w-[17.59px] h-[17.59px]' />
                    )}
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

      <div className='p-4 space-y-6'>
        {data.location &&
          (data.location.city ||
            data.location.state ||
            data.location.country) && (
            <div>
              <h4 className='font-bold text-xl'>Location</h4>
              <p className='text-gray-700'>
                {[
                  data.location.city,
                  data.location.state,
                  data.location.country,
                ]
                  .filter(Boolean)
                  .join(', ') || 'No location specified'}
              </p>
            </div>
          )}

        <div>
          <h4 className='font-bold text-xl'>Property Details</h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {data.configuration && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>
                  Configuration
                </h6>
                <div>{transformString(data.configuration)}</div>
              </div>
            )}
            {data.floorNumber && data.totalFloors && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>Floor</h6>
                <div>
                  {data.floorNumber} of {data.totalFloors}
                </div>
              </div>
            )}
            {data.balconies !== 0 && data.balconies !== null && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>
                  Balconies
                </h6>
                <div>{data.balconies}</div>
              </div>
            )}
            {data.roomSize && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>
                  Room Size
                </h6>
                <div>{data.roomSize} sq ft</div>
              </div>
            )}
            {data.furnishing && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>
                  Furnishing
                </h6>
                <div>{transformString(data.furnishing)}</div>
              </div>
            )}
            {data.sharingType && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>
                  Sharing Type
                </h6>
                <div>{transformString(data.sharingType)}</div>
              </div>
            )}
            {data.unitsAvailable !== null &&
              data.unitsAvailable !== undefined && (
                <div>
                  <h6 className='font-semibold text-md text-gray-800'>
                    Units Available
                  </h6>
                  <div>{data.unitsAvailable}</div>
                </div>
              )}
          </div>
        </div>

        <div>
          <h4 className='font-bold text-xl'>Financial Details</h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {data.brokerage !== null && data.brokerage !== undefined && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>
                  Brokerage
                </h6>
                <div>
                  ₹{data.brokerage} {data.isNegotiable ? '(Negotiable)' : ''}
                </div>
              </div>
            )}
            {data.lockInPeriod && (
              <div>
                <h6 className='font-semibold text-md text-gray-800'>
                  Lock-in Period
                </h6>
                <div>{transformString(data.lockInPeriod)}</div>
              </div>
            )}
            {data.maintenanceCharges !== null &&
              data.maintenanceCharges !== undefined && (
                <div>
                  <h6 className='font-semibold text-md text-gray-800'>
                    Maintenance
                  </h6>
                  <div>
                    ₹{data.maintenanceCharges}{' '}
                    {data.isMaintenanceIncluded
                      ? '(Included)'
                      : '(Not Included)'}
                  </div>
                </div>
              )}
          </div>
        </div>

        <div>
          {data.availableFrom || data.preferredTenant ? (
            <>
              {' '}
              <h4 className='font-bold text-xl'>Additional Information</h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {data.availableFrom && (
                  <div>
                    <h6 className='font-semibold text-md text-gray-800'>
                      Available From
                    </h6>
                    <div>{transformString(data.availableFrom)}</div>
                  </div>
                )}
                {data.preferredTenant && (
                  <div>
                    <h6 className='font-semibold text-md text-gray-800'>
                      Preferred Tenant
                    </h6>
                    <div>{transformString(data.preferredTenant)}</div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {data.amenities && data.amenities.length > 0 && (
          <div>
            <h4 className='font-bold text-xl'>Amenities</h4>
            <div className='flex flex-wrap gap-2'>
              <AmenitiesDisplay data={data.amenities} type='amenities' />
            </div>
          </div>
        )}

        {data.furnishingExtras && data.furnishingExtras.length > 0 && (
          <div>
            <h4 className='font-semibold text-xl'>Furnishings</h4>
            <div className='flex flex-wrap gap-2'>
              <AmenitiesDisplay
                data={data.furnishingExtras}
                type='furnishing'
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
