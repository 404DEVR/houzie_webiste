import { Bath, Bed, Heart, Home, Lock, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyFeature {
  icon: any;
  label: string;
}

interface FinancialDetails {
  icon: any;
  label: string;
  amount: string;
}

export interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    location: {
      city: string;
      state: string;
    };
    price: number;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    photos: string[];
    mainImage: string;
    security: number;
    brokerage: number;
    maintenanceCharges: number;
    isMaintenanceIncluded: boolean;
    availableFrom: string;
  };
  iscreate?: boolean;
  loadImage: (url: string) => Promise<string>;
}

export function PropertyCard({
  property,
  iscreate,
  loadImage,
}: PropertyCardProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mainImageSrc, setMainImageSrc] = useState<string | null>(null);

  const toggleFavorite = () => setFavorites((prev) => !prev);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  useEffect(() => {
    async function loadMainImage() {
      if (property.mainImage) {
        try {
          const cachedUrl = await loadImage(property.mainImage);
          setMainImageSrc(cachedUrl);
        } catch (error) {
          console.error('Error loading image:', error);
          setMainImageSrc('/svg/no-results.svg');
        }
      }
    }
    loadMainImage();
  }, [property.mainImage, loadImage]);

  const propertyFeatures: PropertyFeature[] = [
    { icon: Bed, label: `${property.bedrooms} Beds` },
    { icon: Bath, label: `${property.bathrooms} Baths` },
    { icon: Home, label: property.propertyType },
  ];

  const financialDetails: FinancialDetails[] = [
    { icon: Wallet, label: 'Rent', amount: `₹${property.price}` },
    { icon: Lock, label: 'Security Deposit', amount: `₹${property.security}` },
    { icon: Wallet, label: 'Brokerage', amount: `₹${property.brokerage}` },
  ];

  // if (property.maintenanceCharges > 0) {
  //   financialDetails.push({
  //     icon: Wallet,
  //     label: 'Maintenance',
  //     amount: `₹${property.maintenanceCharges} ${
  //       property.isMaintenanceIncluded ? '(Included)' : '(Extra)'
  //     }`,
  //   });
  // }

  return (
    <Card
      className={`w-full mx-auto overflow-hidden shadow-2xl ${
        iscreate ? 'max-w-full' : 'max-w-[80%]'
      }`}
    >
      <div className='flex flex-col md:flex-row'>
        <div
          className={`mx-auto md:mx-0 ${
            iscreate ? 'w-[300px] h-[250px]' : 'w-[400px] h-[300px]'
          } flex items-center justify-center p-4`}
        >
          <div className='relative w-full h-full'>
            {mainImageSrc ? (
              <Image
                src={mainImageSrc}
                alt={property.title}
                fill
                className='object-cover rounded-md'
                sizes='(max-width: 640px) 100vw, 300px'
              />
            ) : (
              <div className='flex items-center justify-center w-full h-full bg-gray-200 rounded-md'>
                <p>Loading...</p>
              </div>
            )}
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
                {property.title}
              </h3>
              <div className='relative mt-2'>
                <p
                  className={`text-sm text-gray-700 ${
                    isExpanded ? '' : 'line-clamp-1'
                  }`}
                >
                  {property.description || 'No description available.'}
                </p>
                <button
                  onClick={toggleExpanded}
                  className='text-blue-500 text-sm font-medium hover:underline mt-1'
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
                  <feature.icon className='w-[17.59px] h-[17.59px]' />
                  <span className='font-medium text-sm ml-[2.93px]'>
                    {feature.label}
                  </span>
                </Badge>
              ))}
            </div>

            <div className='flex flex-wrap items-start mx-auto md:mx-0 gap-2 max-w-2xl'>
              {financialDetails.map((detail, index) => (
                <Card key={index} className='border-[#eaebef] flex-1'>
                  <CardContent className='flex items-center gap-[1.47px] p-1.5'>
                    <detail.icon className='w-[17.59px] h-[17.59px]' />
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

            {!iscreate && (
              <div className='flex justify-end mt-auto pt-4'>
                <Button
                  onClick={() => router.push(`/property/${property.id}`)}
                  className='w-full md:w-auto border bg-[#42A4AE] rounded-lg px-6 text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
