import { TiLocation } from 'react-icons/ti';

import MapLocationDisplay from '@/components/map/MapLocationDisplay';

import { PropertyPost } from '@/interfaces/Interface';
import { MapCardProps } from '@/interfaces/PropsInterface';

export default function MapCard({
  propertyData = {} as PropertyPost,
  address,
}: MapCardProps) {
  const location = propertyData?.location
    ? {
        lat: propertyData.location.latitude,
        lng: propertyData.location.longitude,
      }
    : { lat: 28.6139, lng: 77.209 }; // Default to Delhi

  return (
    <div className='py-4 bg-white rounded-lg shadow-sm w-full mx-auto z-0 border-b border-gray-200'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>Location</h2>
        <div className='flex items-center gap-2 text-sm mt-1'>{address}</div>
      </div>

      <MapLocationDisplay location={location} />
    </div>
  );
}
