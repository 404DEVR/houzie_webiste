import { TiLocation } from 'react-icons/ti';

import { Property } from '@/components/detailspage/HeaderContainer';
import MapLocationDisplay from '@/components/map/MapLocationDisplay';

interface MapCardProps {
  propertyData: Property;
}

export default function MapCard({
  propertyData = {} as Property,
}: MapCardProps) {
  const location = propertyData?.location
    ? {
        lat: propertyData.location.latitude,
        lng: propertyData.location.longitude,
      }
    : { lat: 28.6139, lng: 77.209 }; // Default to Delhi

  return (
    <div className='p-4 sm:p-6 bg-white rounded-lg shadow-sm w-full mx-auto'>
      <h2 className='text-2xl font-semibold'>Location</h2>
      <div className='flex items-center gap-2 text-sm mt-1'>
        <TiLocation size={20} />
        <span className='text-gray-600'>
          {propertyData?.location?.city || 'Unknown City'},{' '}
          {propertyData?.location?.state || 'Unknown State'}
        </span>
      </div>
      <MapLocationDisplay location={location} />
    </div>
  );
}
