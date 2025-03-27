import axios from 'axios';
import { ArrowRight, Bath, Bed, Building2, Heart, Home } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa6';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';
import useFavorites from '@/hooks/UseFavorites';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { PropertyFeature, PropertyPost } from '@/interfaces/Interface';

const transformString = (str: string | null | undefined) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function PropertySuggestions() {
  const { auth } = useAuth();
  const router = useRouter();
  const toast = useCustomToast();
  const [properties, setProperties] = useState<PropertyPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const { handleFavoriteClick, isListingInFavorites } = useFavorites([]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.houzie.in/listings');
        if (response.data && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          setError('Invalid data structure received from API');
        }
      } catch (error) {
        setError('Failed to fetch property data');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, []);

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

  const getPropertyFeatures = (property: PropertyPost): PropertyFeature[] => {
    const features: PropertyFeature[] = [];

    if (property.bedrooms !== 0 && property.bedrooms !== null) {
      features.push({ icon: Bed, label: `${property.bedrooms}-Bedroom` });
    }
    if (property.bathrooms !== 0 && property.bathrooms !== null) {
      features.push({ icon: Bath, label: `${property.bathrooms}-Bathroom` });
    }
    if (property.balconies !== 0 && property.balconies !== null) {
      features.push({
        icon: Building2,
        label: `${property.balconies} Balcony`,
      });
    }
    if (property.propertyType) {
      features.push({
        icon: Home,
        label: transformString(property.propertyType),
      });
    }

    return features;
  };

  // Example function to fetch property details by id
  const fetchPropertyDetails = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.example.com/properties/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch property details:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!properties || properties.length === 0) {
    return <div>No properties found.</div>;
  }

  return (
    <div className='w-full max-w-[95%] md:max-w-[100%] mx-auto p-4 border  bg-white rounded-lg shadow-sm'>
      <h2 className='text-2xl font-semibold mb-4'>Other suggestions</h2>
      <div className='flex gap-6 overflow-x-auto scrollbar-hide p-6 h-auto'>
        {properties.map((property) => (
          <Card
            key={property.id}
            className='min-w-[360px] max-w-[360px] justify-between h-auto flex flex-col border-none px-2'
          >
            <div>
              <div className='relative'>
                <Image
                  width={330}
                  height={220}
                  src={property.mainImage || '/svg/no-results.svg'}
                  alt={property.title}
                  className='w-full h-[220px] object-cover rounded-lg'
                />
                <Button
                  className='absolute top-0 right-3 p-2'
                  onClick={() => handleFavoriteClick(property)}
                >
                  {isListingInFavorites(property.id) ? (
                    <FaHeart className='w-5 h-5 text-red-600' />
                  ) : (
                    <Heart className='w-5 h-5 text-red-600' />
                  )}
                </Button>
              </div>
              <CardContent className='pt-1 px-0'>
                <h3 className='text-lg font-semibold mb-1'>{property.title}</h3>
                {property.description && (
                  <p className='text-sm text-gray-600 mb-4 line-clamp-2 h-[40px]'>
                    {property.description}
                  </p>
                )}
                <div className='flex gap-2 items-start justify-start flex-wrap h-12'>
                  {getPropertyFeatures(property).map((feature, index) => (
                    <Badge
                      key={index}
                      variant='outline'
                      className='px-0 border-none flex gap-1 justify-start items-center'
                    >
                      <feature.icon className='w-[12px] h-[12px]' />
                      <span className='font-medium text-[12px]'>
                        {feature.label}
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>

            <CardFooter className='px-0 flex'>
              {property.price !== undefined && (
                <div className='flex text-nowrap items-center justify-between flex-[1]'>
                  <div>
                    <p className='text-xs text-gray-500'>Rent</p>
                    <p className='text-lg font-semibold'>₹ {property.price}</p>
                  </div>
                </div>
              )}
              <Button
                onClick={() => handleViewDetails(property.id)}
                className='w-full lg:w-auto border shadow-md bg-[#f5f5fa] rounded-lg px-6 text-[#60a5fa] hover:bg-[#e8e8f5] hover:text-[#60a5fa] transition-colors'
              >
                View Details <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
