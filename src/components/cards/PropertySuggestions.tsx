import axios from 'axios';
import { ArrowRight, Bath, Bed, Building2, Heart, Home } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { Listing, PropertyFeature, PropertyPost } from '@/interfaces/Interface';
import PropertyDetails from '@/components/detailspage/PropertyDetails';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { FaHeart } from 'react-icons/fa6';

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

  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = `https://api.houzie.in/profile/favorites`;
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

      const listingsData = response.data.map((item: any) => item.listing);
      setFavoriteListings(listingsData);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchListings();
  }, [auth?.accessToken, url]);

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

  const removefavorites = async (id: string) => {
    try {
      setIsLoading(true);
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const deleteUrl = `https://api.houzie.in/profile/favorites/${id}`;
      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        toast.success({
          title: 'Success',
          description: 'Property removed from favorites.',
        });

        setFavoriteListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== id)
        );
        await fetchListings();
      } else {
        toast.error({
          title: 'Failed to Remove',
          description:
            'Failed to remove property from favorites. Please Check Your Network Connection',
        });
      }
    } catch (error: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isListingInFavorites = (listingId: string) => {
    return favoriteListings.some((listing) => listing.id === listingId);
  };

  const addFavorites = async (id: string) => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Assuming you have a function to fetch property details by id
      const property = await fetchPropertyDetails(id);

      const response = await axios.post(
        `https://api.houzie.in/profile/favorites/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFavoriteListings((prevListings) => {
        if (!prevListings.some((listing) => listing.id === id)) {
          const newListing: Listing = {
            id: property.id,
            title: property.title,
            description: property.description,
            location: {
              id: '',
              city: property.location.city,
              state: property.location.state,
              country: '',
              latitude: 0,
              longitude: 0,
            },
            brokerId: '',
            isActive: false,
            photos: property.photos,
            mainImage: property.mainImage,
            bathrooms: property.bathrooms,
            bedrooms: property.bedrooms,
            balconies: 0,
            propertyType: property.propertyType,
            views: 0,
            price: property.price,
            security: property.security,
            brokerage: property.brokerage,
            isNegotiable: false,
            lockInPeriod: '',
            availableFrom: property.availableFrom,
            configuration: '',
            floorNumber: '',
            totalFloors: 0,
            maintenanceCharges: property.maintenanceCharges,
            isMaintenanceIncluded: property.isMaintenanceIncluded,
            roomType: '',
            sharingType: '',
            unitsAvailable: '',
            roomSize: '',
            amenities: [],
            features: [],
            furnishing: '',
            furnishingExtras: [],
            preferredTenant: '',
          };

          return [...prevListings, newListing];
        }
        return prevListings;
      });

      toast.success({
        title: 'Success',
        description: 'Property Added to favorites.',
      });
    } catch (error) {
      console.log(error);
    }
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

  const handleFavoriteClick = async (listingId: string) => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      if (isListingInFavorites(listingId)) {
        await removefavorites(listingId);
      } else {
        await addFavorites(listingId);
      }
    } catch (error) {
      console.error(error);
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
    <div className='w-full max-w-[95%] md:max-w-[100%] mx-auto p-4 bg-white rounded-lg shadow-sm'>
      <h2 className='text-2xl font-semibold mb-4'>Other suggestions</h2>
      <div className='flex gap-6 overflow-x-auto scrollbar-hide p-6 h-auto'>
        {properties.map((property) => (
          <Card
            key={property.id}
            className='min-w-[360px] bg-[#eff5ff] max-w-[360px] justify-between h-auto flex flex-col border-none px-2'
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
                  onClick={() => handleFavoriteClick(property.id)}
                >
                  {isListingInFavorites(property.id) ? (
                    <FaHeart className='w-5 h-5 text-red-600' />
                  ) : (
                    <Heart className='w-5 h-5 text-red-600' />
                  )}
                </Button>
              </div>
              <CardContent className='pt-1 px-2'>
                <h3 className='text-lg font-semibold mb-1'>{property.title}</h3>
                {property.description && (
                  <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                    {property.description}
                  </p>
                )}
                <div className='flex gap-2 items-start justify-start flex-wrap h-12'>
                  {getPropertyFeatures(property).map((feature, index) => (
                    <Badge
                      key={index}
                      variant='outline'
                      className=' border-none flex gap-1 justify-center items-center'
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

            <CardFooter className='px-2 flex'>
              {property.price !== undefined && (
                <div className='flex items-center justify-between flex-[1]'>
                  <div>
                    <p className='text-xs text-gray-500'>Rent</p>
                    <p className='text-lg font-semibold'>₹ {property.price}</p>
                  </div>
                </div>
              )}
              <Button
                onClick={() => handleViewDetails(property.id)}
                className='w-full lg:w-auto border bg-[#f5f5fa] rounded-lg px-6 text-[#60a5fa] hover:bg-[#e8e8f5] hover:text-[#60a5fa] transition-colors'
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
