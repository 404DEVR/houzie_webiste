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
    </div>
  );
}
