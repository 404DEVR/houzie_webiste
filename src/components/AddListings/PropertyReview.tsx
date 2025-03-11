import { Bath, Bed, Building2, Home, Lock, Wallet } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    // <Card className='w-full mx-auto overflow-hidden shadow-2xl max-w-full'>
    //   <div className='flex flex-col lg:flex-row'>
    //     <div className='w-full lg:w-[300px] h-[250px] mx-auto lg:mx-0 flex items-center justify-center p-4'>
    //       <div className='relative w-full h-full'>
    //         <Image
    //           src={imageSRC}
    //           alt={data.title || 'Property Image'}
    //           fill
    //           className='object-cover rounded-md'
    //           sizes='(max-width: 640px) 100vw, 300px'
    //         />
    //       </div>
    //     </div>

    //     <div className='flex-1 p-4'>
    //       <div className='space-y-4 h-full flex flex-col'>
    //         <div>
    //           {data.title && (
    //             <h3 className='text-center md:text-start text-xl font-semibold leading-tight'>
    //               {data.title}
    //             </h3>
    //           )}
    //           {data.description && (
    //             <div className='relative mt-2'>
    //               <p
    //                 className={`text-sm text-gray-700 ${
    //                   isExpanded ? '' : 'line-clamp-2'
    //                 }`}
    //               >
    //                 {data.description}
    //               </p>
    //               <button
    //                 onClick={toggleExpanded}
    //                 className='text-blue-500 text-sm text-nowrap font-medium hover:underline'
    //               >
    //                 {isExpanded ? 'Show Less' : 'Read More'}
    //               </button>
    //             </div>
    //           )}
    //         </div>

    //         {propertyFeatures.length > 0 && (
    //           <div className='flex flex-wrap items-center md:items-start justify-center md:justify-start mt-2 mb-4 md:mb-0'>
    //             {propertyFeatures.map((feature, index) => (
    //               <Badge
    //                 key={index}
    //                 variant='outline'
    //                 className=' border-none flex gap-1 justify-center items-center'
    //               >
    //                 <feature.icon className='w-[14px] h-[14px]' />
    //                 <span className='font-medium text-xs'>{feature.label}</span>
    //               </Badge>
    //             ))}
    //           </div>
    //         )}

    //         <div className='flex flex-wrap items-start mx-auto md:mx-0 gap-2 max-w-2xl'>
    //           {financialDetails.map((detail, index) => (
    //             <Card key={index} className='border-[#eaebef] flex-[1]'>
    //               <CardContent className='flex items-center gap-[1.47px] p-1.5'>
    //                 {detail.icon && (
    //                   <detail.icon className='w-[17.59px] h-[17.59px]' />
    //                 )}
    //                 <div className='flex flex-col gap-px flex-1'>
    //                   <div className='text-[#4a4a4a] text-sm text-center font-medium'>
    //                     {detail.label}
    //                   </div>
    //                   <div className='text-black text-[15px] text-center font-semibold'>
    //                     {detail.amount}
    //                   </div>
    //                 </div>
    //               </CardContent>
    //             </Card>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className='p-4 space-y-6'>
    //     {data.location &&
    //       (data.location.city ||
    //         data.location.state ||
    //         data.location.country) && (
    //         <div>
    //           <h4 className='font-bold text-xl'>Location</h4>
    //           <p className='text-gray-700'>
    //             {[
    //               data.location.city,
    //               data.location.state,
    //               data.location.country,
    //             ]
    //               .filter(Boolean)
    //               .join(', ') || 'No location specified'}
    //           </p>
    //         </div>
    //       )}

    //     <div>
    //       <h4 className='font-bold text-xl'>Property Details</h4>
    //       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
    //         {data.configuration && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Configuration
    //             </h6>
    //             <div>{transformString(data.configuration)}</div>
    //           </div>
    //         )}
    //         {data.floorNumber && data.totalFloors && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>Floor</h6>
    //             <div>
    //               {data.floorNumber} of {data.totalFloors}
    //             </div>
    //           </div>
    //         )}
    //         {data.balconies !== 0 && data.balconies !== null && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Balconies
    //             </h6>
    //             <div>{data.balconies}</div>
    //           </div>
    //         )}
    //         {data.roomSize !== 0 && data.roomSize !== null && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Room Size
    //             </h6>
    //             <div>{data.roomSize} sq ft</div>
    //           </div>
    //         )}
    //         {data.furnishing && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Furnishing
    //             </h6>
    //             <div>
    //               {data.furnishing === 'NONE'
    //                 ? 'Unfurnished'
    //                 : transformString(data.furnishing)}
    //             </div>
    //           </div>
    //         )}
    //         {data.sharingType && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Sharing Type
    //             </h6>
    //             <div>{transformString(data.sharingType)}</div>
    //           </div>
    //         )}
    //         {data.unitsAvailable !== 0 && data.unitsAvailable !== null && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Units Available
    //             </h6>
    //             <div>{data.unitsAvailable}</div>
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     <div>
    //       <h4 className='font-bold text-xl'>Financial Details</h4>
    //       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
    //         {data.brokerage && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Brokerage
    //             </h6>
    //             <div>
    //               ₹{data.brokerage} {data.isNegotiable ? '(Negotiable)' : ''}
    //             </div>
    //           </div>
    //         )}
    //         {data.lockInPeriod && (
    //           <div>
    //             <h6 className='font-semibold text-md text-gray-800'>
    //               Lock-in Period
    //             </h6>
    //             <div>{transformString(data.lockInPeriod)}</div>
    //           </div>
    //         )}
    //         {data.maintenanceCharges !== 0 &&
    //           data.maintenanceCharges !== null && (
    //             <div>
    //               <h6 className='font-semibold text-md text-gray-800'>
    //                 Maintenance
    //               </h6>
    //               <div>
    //                 ₹{data.maintenanceCharges}{' '}
    //                 {data.isMaintenanceIncluded
    //                   ? '(Included)'
    //                   : '(Not Included)'}
    //               </div>
    //             </div>
    //           )}
    //       </div>
    //     </div>

    //     <div>
    //       {data.availableFrom || data.preferredTenant ? (
    //         <>
    //           <h4 className='font-bold text-xl'>Additional Information</h4>
    //           <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
    //             {data.availableFrom && (
    //               <div>
    //                 <h6 className='font-semibold text-md text-gray-800'>
    //                   Available From
    //                 </h6>
    //                 <div>{formatDateString(data.availableFrom)}</div>
    //               </div>
    //             )}
    //             {data.preferredTenant && (
    //               <div>
    //                 <h6 className='font-semibold text-md text-gray-800'>
    //                   Preferred Tenant
    //                 </h6>
    //                 <div>{transformString(data.preferredTenant)}</div>
    //               </div>
    //             )}
    //           </div>
    //         </>
    //       ) : null}
    //     </div>

    //     {data.amenities && data.amenities.length > 0 && (
    //       <div>
    //         <h4 className='font-bold text-xl'>Amenities</h4>
    //         <div className='flex flex-wrap gap-2'>
    //           <AmenitiesDisplay data={data.amenities} type='amenities' />
    //         </div>
    //       </div>
    //     )}

    //     {data.furnishingExtras && data.furnishingExtras.length > 0 && (
    //       <div>
    //         <h4 className='font-semibold text-xl'>Furnishings</h4>
    //         <div className='flex flex-wrap gap-2'>
    //           <AmenitiesDisplay
    //             data={data.furnishingExtras}
    //             type='furnishing'
    //           />
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </Card>
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
          <div className='md:w-[70%] pt-4 md:pt-10'>
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

          <div className='flex flex-col items-center p-2 md:items-start '>
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
                  Gurgaon
                </span>
              </div>
            </div>

            <div className='flex gap-4 md:gap-6 mt-0 w-full md:w-auto'>
              <Button
                className='text-blue-500 bg-blue-50 hover:bg-blue-100 border text-lg rounded-md shadow-sm w-full md:w-auto'
                size='sm'
              >
                Edit
              </Button>
              <Button
                className='text-red-500 bg-blue-50 hover:bg-red-100 border text-lg rounded-md shadow-sm w-full md:w-auto'
                size='sm'
              >
                Unpost
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
