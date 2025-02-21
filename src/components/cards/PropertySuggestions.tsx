import axios from 'axios';
import { Bath, Bed, Building2, Heart, Home } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  const [properties, setProperties] = useState<PropertyPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

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

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const getPropertyFeatures = (property: PropertyPost): PropertyFeature[] => {
    const features: PropertyFeature[] = [];

    if (property.bedrooms !== 0) {
      features.push({ icon: Bed, label: `${property.bedrooms}-Bedroom` });
    }
    if (property.bathrooms !== 0) {
      features.push({ icon: Bath, label: `${property.bathrooms}-Bathroom` });
    }
    if (property.balconies !== 0) {
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
    <div className='w-full max-w-[95%] md:max-w-[100%] mx-auto p-4 bg-white rounded-lg shadow-sm'>
      <h2 className='text-2xl font-semibold mb-4'>Other suggestions</h2>
      <div className='flex gap-12 overflow-x-auto scrollbar-hide px-4'>
        {properties.map((property) => (
          <Card
            key={property.id}
            className='min-w-[300px] max-w-[330px] flex flex-col border-none px-0'
          >
            <div className='relative'>
              <Image
                width={330}
                height={220}
                src={property.mainImage || '/svg/no-results.svg'}
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
              {property.description && (
                <p className='text-sm text-gray-600 mb-4'>
                  {property.description.slice(0, 100)}...
                  <button className='underline ml-1 text-black'>
                    Read More
                  </button>
                </p>
              )}
              <div className='flex gap-2 flex-wrap'>
                {getPropertyFeatures(property).map((feature, index) => (
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
              {property.price !== undefined && (
                <div className='flex items-center justify-between flex-[1]'>
                  <div>
                    <p className='text-sm text-gray-500'>Rent</p>
                    <p className='text-lg font-semibold'>₹ {property.price}</p>
                  </div>
                </div>
              )}
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
