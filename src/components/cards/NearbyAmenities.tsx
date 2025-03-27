'use client';

import { useEffect, useMemo, useState } from 'react';

import { NearbyAmenitiesProps } from '@/interfaces/PropsInterface';
import PlacesNearby from '@/components/cards/PlacesNearby';
import { NearbyPlaces } from '@/interfaces/Interface';

export default function NearbyAmenities({
  propertyData,
}: NearbyAmenitiesProps) {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaces | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [place, setPlace] = useState<any>(null);
  const [type, setType] = useState<string>(
    'school,university,grocery_or_supermarket,shopping_mall,hospital,subway_station,gym,natural_feature'
  );

  const getHeading = (heading: string) => {
    switch (heading) {
      case 'grocery_or_supermarket':
        return 'Grocery Store';
      case 'subway_station':
        return 'Metro Station';
      case 'natural_feature':
        return 'Natural Feature';
      case 'school':
        return 'School';
      case 'university':
        return 'University';
      case 'shopping_mall':
        return 'Market';
      case 'hospital':
        return 'Hospital';
      case 'gym':
        return 'Gym Wellness';
      default:
        return '';
    }
  };

  useEffect(() => {
    async function fetchNearbyPlaces() {
      try {
        const lat = propertyData.location.latitude;
        const lng = propertyData.location.longitude;
        const types = type;
        console.log(lat);

        const res = await fetch(
          `/api/places?lat=${lat}&lng=${lng}&types=${types}`
        );
        const data = await res.json();

        if (res.ok) {
          setNearbyPlaces(data.nearestPlaces);
        } else {
          setError(data.error || 'Failed to fetch places');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchNearbyPlaces();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className='w-full py-4 bg-white'>
      <h2 className='text-2xl font-medium text-[#3a414e] mb-4'>
        What's Nearby?
      </h2>
      <p className='text-gray-600 text-sm mb-6'>
        Explore nearby amenities to precisely locate your property and identify
        surrounding conveniences, providing a comprehensive overview of the
        living environment and the property's convenience.
      </p>

      {loading ? (
        <p>Loading nearby places...</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-[60%]'>
          <div className='flex flex-col justify-start items-start gap-4 text-gray-800'>
            {nearbyPlaces ? (
              <ul className='space-y-4'>
                {Object.entries(nearbyPlaces)
                  .slice(0, 4)
                  .map(([type, place]) => (
                    <div key={type} className='flex justify-between w-48'>
                      <span className='font-normal text-[#adb0b2]'>
                        {getHeading(type)}:
                      </span>
                      {place ? (
                        <span className='text-[#656a74]'>
                          {place.distance.toFixed(2)} Km
                        </span>
                      ) : (
                        <p>No {type} found nearby.</p>
                      )}
                    </div>
                  ))}
              </ul>
            ) : (
              <p>No data available.</p>
            )}
          </div>
          <div className='flex flex-col justify-start items-start gap-4 text-gray-800'>
            {nearbyPlaces ? (
              <ul className='space-y-4'>
                {Object.entries(nearbyPlaces)
                  .slice(4, 8)
                  .map(([type, place]) => (
                    <div key={type} className='flex justify-between w-48'>
                      <span className='font-normal text-[#adb0b2]'>
                        {getHeading(type)}:
                      </span>
                      {place ? (
                        <span className='text-[#656a74]'>
                          {place.distance.toFixed(2)} Km
                        </span>
                      ) : (
                        <p>No {type} found nearby.</p>
                      )}
                    </div>
                  ))}
              </ul>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
