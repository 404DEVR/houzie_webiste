'use client';

import axios from 'axios'; // Assuming you have axios configured
import {
  Bath,
  Bed,
  Building2,
  Edit,
  Eye,
  Heart,
  Home,
  Trash2,
  IndianRupee,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import AddListings from '@/components/AddListings/AddListings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { populateEditForm, startEditing } from '@/redux/slices/formslices';

interface PropertyFeature {
  icon: React.ElementType;
  label: string;
}

interface FinancialDetail {
  icon: React.ElementType;
  label: string;
  amount: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  location: {
    id: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  brokerId: string;
  isActive: boolean;
  photos: string[];
  mainImage: string;
  bathrooms: number | null;
  bedrooms: number | null;
  balconies: number | null;
  propertyType: string;
  views: number;
  price: number;
  security: number;
  brokerage: number;
  isNegotiable: boolean;
  lockInPeriod: string;
  availableFrom: string;
  configuration: string;
  floorNumber: string;
  totalFloors: number | null;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  roomType: string | null;
  sharingType: string | null;
  unitsAvailable: string | null;
  roomSize: string | null;
  amenities: string[];
  features: string[];
  furnishing: string | null;
  furnishingExtras: string[];
  preferredTenant: string;
}

interface MyListingsProps {}

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

const MyListings = ({}: MyListingsProps) => {
  const router = useRouter();
  const { auth } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = ``;

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const accessToken = auth?.accessToken;
        if (!accessToken) {
          throw new Error('No access token available');
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setListings(response.data);
      } catch (error) {
        toast({
          title: 'Failed To Fetch Listings',
          description: 'Please Check YOur Network Connection',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [auth?.accessToken, url]);

  const getPropertyFeatures = (listing: Listing): PropertyFeature[] => {
    const features: PropertyFeature[] = [];

    if (listing.bedrooms) {
      features.push({ icon: Bed, label: `${listing.bedrooms}-Bedroom` });
    }
    if (listing.bathrooms) {
      features.push({ icon: Bath, label: `${listing.bathrooms}-Bathroom` });
    }
    if (listing.balconies) {
      features.push({ icon: Building2, label: `${listing.balconies}-Balcony` });
    }
    features.push({
      icon: Home,
      label: transformString(listing.propertyType),
    });
    return features;
  };

  const getFinancialDetails = (listing: Listing): FinancialDetail[] => {
    const details: FinancialDetail[] = [];

    details.push({
      icon: IndianRupee,
      label: 'Rent',
      amount: `₹ ${listing.price}`,
    });
    details.push({
      icon: ShieldCheck,
      label: 'Security',
      amount: `₹ ${listing.security}`,
    });
    details.push({
      icon: KeyRound,
      label: 'Brokerage',
      amount: `₹ ${listing.brokerage}`,
    });

    return details;
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [iscreate, setIscreate] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFavorite = () => {
    setFavorites(!favorites);
  };

  return (
    <div className='container mx-auto pb-8 pt-4 border px-2 sm:px-4 my-4 rounded-lg'>
      <h1 className='text-xl sm:text-2xl font-bold mb-4'>My Favorites</h1>

      {isLoading ? (
        <p>Loading listings...</p>
      ) : Array.isArray(listings) && listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className='space-y-4'>
          {Array.isArray(listings) &&
            listings.map((property) => {
              const propertyFeatures = getPropertyFeatures(property);
              const financialDetails = getFinancialDetails(property);
              const mainImageSrc = property.mainImage || '/svg/no-results.svg';

              return (
                <Card
                  key={property.id}
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
                              {property.description ||
                                'No description available.'}
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
                            <Card
                              key={index}
                              className='border-[#eaebef] flex-1'
                            >
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
                              onClick={() =>
                                router.push(`/property/${property.id}`)
                              }
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
            })}
        </div>
      )}
    </div>
  );
};

export default MyListings;
