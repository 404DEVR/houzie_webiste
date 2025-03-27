import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import useAuth from '@/hooks/useAuth';

import { Listing, PropertyPost } from '@/interfaces/Interface';

const useFavorites = (initialFavorites: Listing[]) => {
  const { auth } = useAuth();
  const url = `https://api.houzie.in/profile/favorites`;
  const [favoriteListings, setFavoriteListings] =
    useState<Listing[]>(initialFavorites);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const addfavorites = async (property: PropertyPost) => {
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

  const handleFavoriteClick = async (property: PropertyPost) => {
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

  return {
    handleFavoriteClick,
    isListingInFavorites,
    favoriteListings,
    isLoading,
  };
};

export default useFavorites;
