import { CreditCard, ShoppingBag, Utensils } from 'lucide-react';
import { FaLocationArrow } from 'react-icons/fa6';
import { TiLocation } from 'react-icons/ti';

import { Card, CardContent } from '@/components/ui/card';

const places = [
  {
    type: 'Restaurant',
    name: 'Momo point',
    location: 'Noida sector-18 metro station',
    distance: '0.9km',
    icon: <Utensils size={16} />,
  },
  {
    type: 'Mall',
    name: 'Brahmaputra complex',
    location: 'Noida sector-Brahmaputra complex',
    distance: '1.6 km',
    icon: <ShoppingBag size={16} />,
  },
  {
    type: 'ATM',
    name: 'Hdfc ATM',
    location: 'Noida sector-Hdfc ATM',
    distance: '1.9 km',
    icon: <CreditCard size={16} />,
  },
];

export default function PlacesNearby() {
  return (
    <div className='p-4 sm:p-6 bg-white rounded-lg shadow-sm w-full mx-auto'>
      <h2 className='text-2xl font-semibold'>Places nearby</h2>
      <div className='flex items-center gap-2 text-sm mt-1'>
        <TiLocation size={20} />
        <span className='text-gray-600'>Block D, Sector 27, Noida</span>
      </div>
      <div className='mt-4 overflow-x-auto'>
        <div className='flex gap-3 pb-4'>
          {places.map((place, index) => (
            <Card
              key={index}
              className='border rounded-lg p-3 bg-[#F9FAFB] shadow-sm flex-shrink-0'
              style={{ width: '250px' }}
            >
              <CardContent className='p-0'>
                <div className='flex items-center gap-2 text-md font-semibold'>
                  {place.icon} <span className='text-sm'>{place.type}</span>
                </div>
                <h3 className='text-xl font-medium mt-1'>{place.name}</h3>
                <p className='text-xs text-gray-500 mt-1'>{place.location}</p>
                <div className='flex items-center gap-1 text-gray-500'>
                  <FaLocationArrow className='w-3 h-3' />
                  <p className='text-xs'>{place.distance}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
