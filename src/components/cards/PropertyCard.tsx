import axios from 'axios';
import { ArrowRight, Bath, Bed, Heart, Home, Lock, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { FinancialDetails, PropertyFeature } from '@/interfaces/Interface';
import { PropertyCardProps } from '@/interfaces/PropsInterface';

export function PropertyCard({
  property,
  iscreate,
  loadImage,
}: PropertyCardProps) {
  const toast = useCustomToast();
  const { auth } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mainImageSrc, setMainImageSrc] = useState<string | null>(null);
  const transformString = (str: string | null | undefined) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const toggleFavorite = () => setFavorites((prev) => !prev);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setShowReadMore(
          textRef.current.scrollHeight > textRef.current.clientHeight
        );
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [property.description]);

  useEffect(() => {
    async function loadMainImage() {
      if (property.mainImage) {
        try {
          const cachedUrl = await loadImage(property.mainImage);
          setMainImageSrc(cachedUrl);
        } catch (error) {
          setMainImageSrc('/svg/no-results.svg');
        }
      }
    }
    loadMainImage();
  }, [property.mainImage, loadImage]);

  const propertyFeatures: PropertyFeature[] = [
    ...(property.bedrooms !== 0
      ? [{ icon: Bed, label: `${property.bedrooms} Beds` }]
      : []),
    ...(property.bathrooms !== 0
      ? [{ icon: Bath, label: `${property.bathrooms} Baths` }]
      : []),
    ...(property.propertyType
      ? [
          {
            icon: Home,
            label: transformString(property.propertyType),
          },
        ]
      : []),
  ];

  const financialDetails: FinancialDetails[] = [
    ...(property.price
      ? [{ icon: Wallet, label: 'Rent', amount: `₹${property.price}` }]
      : []),
    ...(property.security
      ? [
          {
            icon: Lock,
            label: 'Security Deposit',
            amount: `₹${property.security}`,
          },
        ]
      : []),
    ...(property.brokerage
      ? [{ icon: Wallet, label: 'Brokerage', amount: `₹${property.brokerage}` }]
      : []),
  ];

  if (property.maintenanceCharges > 0) {
    financialDetails.push({
      icon: Wallet,
      label: 'Maintenance',
      amount: `₹${property.maintenanceCharges} ${
        property.isMaintenanceIncluded ? '(Included)' : '(Extra)'
      }`,
    });
  }

  const handleViewDetails = async (id: string) => {
    const accessToken = auth?.accessToken;

    if (!accessToken) {
      toast.error({
        title: 'Unauthorized',
        description: 'You are not authorized.',
      });
      router.push(`/login?redirect=property/${id}`);
      return;
    }

    try {
      await axios.post(
        `https://api.houzie.in/profile/visited/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      router.push(`/property/${id}`);
    } catch (error: any) {
      toast.error({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to record visit. Try again.',
      });
    }
  };

  return (
    // <Card
    //   className={`w-full mx-auto overflow-hidden shadow-2xl ${
    //     iscreate ? 'max-w-full' : 'max-w-full'
    //   }`}
    // >
    //   <div className='flex flex-col lg:flex-row'>
    //     <div
    //       className={`mx-auto lg:mx-0 ${
    //         iscreate ? 'w-[300px] h-[250px]' : 'w-[400px] h-[300px]'
    //       } flex items-center justify-center p-4`}
    //     >
    //       <div className='relative w-full h-full'>
    //         {mainImageSrc ? (
    //           <Image
    //             src={mainImageSrc}
    //             alt={property.title}
    //             fill
    //             className='object-cover rounded-md'
    //             sizes='(max-width: 640px) 100vw, 300px'
    //           />
    //         ) : (
    //           <div className='flex items-center justify-center w-full h-full bg-gray-200 rounded-md'>
    //             <p>Loading...</p>
    //           </div>
    //         )}
    //         <button
    //           className='absolute top-3 right-3 p-2'
    //           onClick={toggleFavorite}
    //         >
    //           <Heart
    //             className='w-5 h-5 text-[#42A4AE]'
    //             fill={favorites ? '#42A4AE' : 'transparent'}
    //           />
    //         </button>
    //       </div>
    //     </div>

    //     <div className='flex-1 p-4'>
    //       <div className='space-y-4 h-full flex flex-col'>
    //         {property.title && (
    //           <h3 className='text-center lg:text-start text-xl font-semibold leading-tight'>
    //             {property.title}
    //           </h3>
    //         )}

    //         {property.description && (
    //           <div className='mt-2'>
    //             <div className='relative'>
    //               <p
    //                 ref={textRef}
    //                 className={`text-sm text-center lg:text-start text-gray-700 ${
    //                   isExpanded ? '' : 'line-clamp-2'
    //                 }`}
    //                 style={{ wordBreak: 'break-word' }}
    //               >
    //                 {property.description}
    //               </p>
    //             </div>
    //             {showReadMore && (
    //               <div className='text-right mt-1'>
    //                 <button
    //                   onClick={toggleExpanded}
    //                   className='text-blue-500 text-sm font-medium hover:underline'
    //                 >
    //                   {isExpanded ? 'Show Less' : 'Read More'}
    //                 </button>
    //               </div>
    //             )}
    //           </div>
    //         )}

    //         {propertyFeatures.length > 0 && (
    //           <div className='flex flex-wrap items-start justify-center lg:justify-start gap-2'>
    //             {propertyFeatures.map((feature, index) => (
    //               <Badge
    //                 key={index}
    //                 variant='outline'
    //                 className='bg-[#191919] text-white border-neutral-800 px-[10.26px] py-[5.86px] rounded-[20.53px]'
    //               >
    //                 <feature.icon className='w-[17.59px] h-[17.59px]' />
    //                 <span className='font-medium text-sm ml-[2.93px]'>
    //                   {feature.label}
    //                 </span>
    //               </Badge>
    //             ))}
    //           </div>
    //         )}

    //         {financialDetails.length > 0 && (
    //           <div className='flex flex-wrap items-start mx-auto lg:mx-0 gap-2 max-w-2xl'>
    //             {financialDetails.map((detail, index) => (
    //               <Card key={index} className='border-[#eaebef] flex-1'>
    //                 <CardContent className='flex items-center gap-[1.47px] p-1.5'>
    //                   <detail.icon className='w-[17.59px] h-[17.59px]' />
    //                   <div className='flex flex-col gap-px flex-1'>
    //                     <div className='text-[#4a4a4a] text-sm text-center font-medium'>
    //                       {detail.label}
    //                     </div>
    //                     <div className='text-black text-[15px] text-center font-semibold'>
    //                       {detail.amount}
    //                     </div>
    //                   </div>
    //                 </CardContent>
    //               </Card>
    //             ))}
    //           </div>
    //         )}

    // {!iscreate && (
    //   <div className='flex justify-end mt-auto pt-4'>
    //     <Button
    //       onClick={() => handleViewDetails(property.id)}
    //       className='w-full lg:w-auto border bg-[#42A4AE] rounded-lg px-6 text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
    //     >
    //       View Details
    //     </Button>
    //   </div>
    // )}
    //       </div>
    //     </div>
    //   </div>
    // </Card>
    <Card className='w-full mx-auto shadow-md rounded-2xl bg-[#eff6ff] border transition-all duration-300 overflow-hidden'>
      <CardContent className='p-2 flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-[350px] h-[180px] flex items-center justify-center'>
          <div className='relative w-full h-full'>
            <Image
              src={property.mainImage || '/svg/no-results.svg'}
              alt={property.title}
              fill
              className='object-cover rounded-2xl'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        </div>

        <div className='w-full flex flex-col md:flex-row'>
          <div className='md:w-[60%] pt-4 md:pt-10'>
            <div className='flex flex-col justify-between items-center md:items-start mb-6'>
              <h2 className='text-base sm:text-xl font-semibold mb-2'>
                {property.title}
              </h2>
              <h3 className='text-xs font-normal line-clamp-2 w-[90%] text-center md:text-start'>
                {property.description}
              </h3>
            </div>

            <div className='flex flex-wrap items-center md:items-start justify-center md:justify-start mt-2 mb-4 md:mb-0'>
              {propertyFeatures.map((feature, index) => (
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
          </div>

          <div className='flex flex-col items-center p-2 md:items-start'>
            <div className='flex gap-6 mb-4 flex-wrap md:flex-nowrap '>
              <div className='mb-1'>
                <p className='text-gray-500 text-xs'>Rent</p>
                <span className='text-black text-2xl font-semibold flex gap-2'>
                  <span>₹</span> {property.price}
                </span>
              </div>
              <div className='mb-1'>
                <p className='text-gray-500 text-xs'>Location:</p>
                <span className='text-black text-2xl font-semibold'>
                  Gurgaon
                </span>
              </div>
            </div>
            <div className='flex gap-6 mb-0 flex-wrap md:flex-nowrap '>
              <div className='mb-1'>
                <p className='text-gray-500 text-xs'>Brokerage</p>
                <span className='text-black text-2xl font-semibold flex gap-2'>
                  <span>₹</span> {property.brokerage}
                </span>
              </div>
              <div className='mb-1'>
                <p className='text-gray-500 text-xs'>Security</p>
                <span className='text-black text-2xl font-semibold'>
                  <span>₹</span> {property.security}
                </span>
              </div>
            </div>
            {!iscreate && (
              <div className='flex justify-end mt-auto pt-0'>
                <Button
                  onClick={() => handleViewDetails(property.id)}
                  className='w-full lg:w-auto border bg-[#f5f5fa] rounded-lg px-6 text-[#60a5fa] hover:bg-[#e8e8f5] hover:text-[#60a5fa] transition-colors'
                >
                  View Details
                  <ArrowRight />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className='relative'>
          <Button
            className='absolute top-0 right-3 p-2'
            onClick={toggleFavorite}
          >
            <Heart
              className='w-5 h-5 text-red-600'
              fill={favorites ? '#42A4AE' : 'transparent'}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
