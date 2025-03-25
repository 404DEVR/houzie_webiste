'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { Bath, Bed, Heart, Home, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaHeart } from 'react-icons/fa6';

import useAuth from '@/hooks/useAuth';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { Listing, PropertyPost } from '@/interfaces/Interface';
const url = `https://api.houzie.in/profile/favorites`;

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 28.4746,
  lng: 77.0605,
};

interface MapComponentProps {
  properties: PropertyPost[];
}

export default function MapComponent({ properties }: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || '',
    libraries: ['places'],
  });
  const { auth } = useAuth();

  const [selectedProperty, setSelectedProperty] = useState<PropertyPost | null>(
    null
  );
  const [markerPosition, setMarkerPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const router = useRouter();
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const transformString = (str: string | null | undefined) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
        setFavoriteListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== id)
        );
        await fetchListings();
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

  const addfavorites = async (property) => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await axios.post(
        `https://api.houzie.in/profile/favorites/${property.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFavoriteListings((prevListings) => {
        if (!prevListings.some((listing) => listing.id === property.id)) {
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteClick = async (property) => {
    if (!auth?.accessToken) {
      router.push(`/login?redirect=property`);
      return;
    }
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      if (isListingInFavorites(property.id)) {
        await removefavorites(property.id);
      } else {
        await addfavorites(property);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProertyFeatures = (property) => [
    ...(property.bedrooms !== 0 && property.bedrooms !== null
      ? [{ icon: Bed, label: `${property.bedrooms} Beds` }]
      : []),
    ...(property.bathrooms !== 0 && property.bathrooms !== null
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

  const handleMarkerClick = (property: PropertyPost) => {
    setSelectedProperty(property);

    // Center the map on the clicked marker
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: property.location.latitude,
        lng: property.location.longitude,
      });
    }

    // Ensure the map is fully loaded before accessing projection
    setTimeout(() => {
      if (mapRef.current) {
        const projection = mapRef.current.getProjection();

        if (!projection) {
          console.warn('Projection is not available yet. Retrying...');
          return;
        }

        const position = new google.maps.LatLng(
          property.location.latitude,
          property.location.longitude
        );
        const point = projection.fromLatLngToPoint(position);

        if (point) {
          setMarkerPosition({ top: point.y, left: point.x });
        }
      }
    }, 100);
  };

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onMapClick = () => {
    setSelectedProperty(null);
    setMarkerPosition(null);
  };

  const formatPrice = (price) => {
    if (price >= 1_00_00_000) {
      return `${(price / 1_00_00_000).toFixed(1)} Cr`;
    } else if (price >= 1_00_000) {
      return `${(price / 1_00_000).toFixed(1)} L`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`;
    }
    return price.toString();
  };

  return (
    <div className='relative w-full h-screen'>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onClick={onMapClick}
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={{
                lat: property.location.latitude,
                lng: property.location.longitude,
              }}
              onClick={(event) => handleMarkerClick(property)}
            />
          ))}
        </GoogleMap>
      )}

      {/* Property Details Card (Positioned Near Marker) */}
      {selectedProperty && markerPosition && (
        <div
          className='absolute z-50 shadow-xl'
          style={{
            top: `${markerPosition.top}px`,
            left: `${markerPosition.left}px`,
            transform: 'translateY(-30%)',
          }}
        >
          <Card className='relative w-[350px] shadow-xl rounded-xl overflow-hidden bg-white'>
            {/* Close and Like Icons */}
            <div className='absolute top-2 right-2 flex gap-2 z-10'>
              <Button
                className='bg-white py-2 px-3 rounded-full shadow-md'
                onClick={() => handleFavoriteClick(selectedProperty)}
              >
                {isListingInFavorites(selectedProperty.id) ? (
                  <FaHeart className='w-5 h-5 text-red-600' />
                ) : (
                  <Heart className='w-5 h-5 ' />
                )}
              </Button>
              <button
                className='bg-white py-2 px-2.5 rounded-full shadow-md'
                onClick={() => setSelectedProperty(null)}
              >
                <X className='w-5 h-5 text-gray-600' />
              </button>
            </div>

            {/* Property Image */}
            <CardHeader className='p-0 relative'>
              <Carousel className='relative'>
                <CarouselContent>
                  <CarouselItem>
                    <Image
                      src={selectedProperty.mainImage}
                      alt='Main Image'
                      width={350}
                      height={200}
                      className='rounded-t-xl w-full h-[200px] object-cover'
                    />
                  </CarouselItem>

                  {selectedProperty.photos
                    .filter((photo) => photo !== selectedProperty.mainImage)
                    .map((photo, id) => (
                      <CarouselItem key={id}>
                        <Image
                          src={photo}
                          alt={`Image ${id}`}
                          width={350}
                          height={200}
                          className='rounded-t-xl w-full h-[200px] object-cover'
                        />
                      </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className='absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full' />
                <CarouselNext className='absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full' />
              </Carousel>
            </CardHeader>

            {/* Property Details */}
            <CardContent className='px-4 py-2'>
              <h2 className='text-lg font-semibold'>
                {selectedProperty.title}
              </h2>
              <div className='flex gap-4 items-center justify-start my-1'>
                {getProertyFeatures(selectedProperty).map((feature, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='border-none flex gap-1 p-0 justify-center items-center'
                  >
                    <feature.icon className='w-[14px] h-[14px]' />
                    <span className='font-medium text-xs text-nowrap'>
                      {feature.label}
                    </span>
                  </Badge>
                ))}
              </div>
              <div className='flex justify-between items-center my-2'>
                <div className='mb-1'>
                  <p className='text-gray-500 text-xs'>Rent</p>
                  <span className='text-black text-base font-semibold flex gap-2'>
                    <span>₹</span> {formatPrice(selectedProperty.price)}
                  </span>
                </div>
                <div className='mb-1'>
                  <p className='text-gray-500 text-xs'>Brokerage</p>
                  <span className='text-black text-base font-semibold flex gap-2'>
                    <span>₹</span> {formatPrice(selectedProperty.brokerage)}
                  </span>
                </div>
                <div className='mb-1'>
                  <p className='text-gray-500 text-xs'>Security</p>
                  <span className='text-black text-base font-semibold'>
                    <span>₹</span> {formatPrice(selectedProperty.security)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
