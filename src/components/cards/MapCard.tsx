import MapLocationDisplay from '@/components/map/MapLocationDisplay';

import { NearbyPlaces, PropertyPost } from '@/interfaces/Interface';
import { MapCardProps } from '@/interfaces/PropsInterface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function MapCard({
  propertyData = {} as PropertyPost,
  address,
}: MapCardProps) {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaces | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [place, setPlace] = useState<any>(null);
  const [type, setType] = useState<string>('subway_station');

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
  const location = propertyData?.location
    ? {
        lat: propertyData.location.latitude,
        lng: propertyData.location.longitude,
      }
    : { lat: 28.6139, lng: 77.209 };

  const metro = nearbyPlaces?.subway_station;
  const mapData = [
    {
      label: 'Distance From Work',
      value: `13 Min`,
      icon: '/svg/office.svg',
      hasIcon: false,
    },
    {
      label: 'Distance From Nearest Metro',
      value: metro && `${metro.distance.toFixed(2)} km`,
      icon: '/svg/metro.svg',
      hasIcon: false,
    },
  ];

  return (
    <div className='py-4 bg-white rounded-lg shadow-sm w-full mx-auto z-0 border-b border-gray-200'>
      <div className=' mb-4'>
        <h2 className='text-2xl font-semibold'>Location</h2>
        <div className='flex items-center gap-2 text-sm mt-1 line-clamp-2'>
          {address}
        </div>
      </div>

      <MapLocationDisplay location={location} />

      <div className='w-full flex justify-between items-center'>
        {mapData.map((detail, index) => (
          <div key={index}>
            <div className='flex gap-4 items-center py-3'>
              <div className='p-4 border border-black rounded-lg mr-2'>
                <Image
                  src={detail.icon}
                  alt={detail.icon}
                  width={25}
                  height={25}
                />
              </div>
              <div>
                <div className='text-[#6f6f6f] text-nowrap text-xl leading-[21px]'>
                  {detail.label}
                </div>
                {loading ? (
                  <p>Loading Details...</p>
                ) : (
                  <div className='flex text-nowrap text-[#3b8ff6] items-center gap-1.5 font-medium text-2xl'>
                    {detail.value}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
