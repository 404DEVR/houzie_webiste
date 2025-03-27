'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import { MapLocationDisplayProps } from '@/interfaces/PropsInterface';

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function MapLocationDisplay({
  location,
}: MapLocationDisplayProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || '',
    libraries: ['places'],
  });

  const center = useMemo(() => {
    return {
      lat: location.lat,
      lng: location.lng,
    };
  }, [location.lat, location.lng]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      map.setCenter(center);
    },
    [center]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = () => {
    if (map) {
      map.setZoom(15);
      map.panTo(center);
    }
  };

  const mapData = [
    {
      label: 'Distance From Work',
      value: `13 Min`,
      icon: '/svg/office.svg',
      hasIcon: false,
    },
    {
      label: 'Distance From Nearest Metro',
      value: `7 Min`,
      icon: '/svg/metro.svg',
      hasIcon: false,
    },
  ];

  return (
    <div className='w-full'>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={center} onClick={handleMarkerClick} />
        </GoogleMap>
      )}
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
                <div className='flex text-nowrap text-[#3b8ff6] items-center gap-1.5 font-medium text-2xl'>
                  {detail.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
