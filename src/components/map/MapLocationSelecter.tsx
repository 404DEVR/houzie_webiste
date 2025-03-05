'use client';

import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Location,
  MapLocationSelectorProps,
} from '@/interfaces/PropsInterface';

function LocationMarker({
  location,
  setLocation,
}: {
  location: Location | null;
  setLocation: (location: Location) => void;
}) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (location) {
      map.flyTo(location, map.getZoom());
    }
  }, [location, map]);

  return location === null ? null : (
    <Marker
      position={location}
      icon={
        new Icon({
          iconUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      }
    />
  );
}

export default function MapLocationSelector({
  onLocationSave,
  initialLocation = null,
}: MapLocationSelectorProps) {
  const defaultLocation: Location = { lat: 28.4595, lng: 77.0266 };
  const [location, setLocation] = useState<Location | null>(
    initialLocation !== null ? initialLocation : defaultLocation
  );

  const handleSaveLocation = () => {
    if (location) {
      onLocationSave(location);
    }
  };

  return (
    <div className='space-y-4'>
      <Label
        htmlFor='fullAddress'
        className='text-2xl text-[#646464] font-normal mb-2'
      >
        Location
      </Label>
      <div className='h-[400px] w-full'>
        <MapContainer
          center={location || defaultLocation}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <LocationMarker location={location} setLocation={setLocation} />
        </MapContainer>
      </div>
      <div className='flex flex-wrap gap-6'>
        <div className='grid w-full md:w-[44%] items-center gap-1.5'>
          <Label htmlFor='latitude'>Latitude</Label>
          <Input
            type='number'
            id='latitude'
            value={location?.lat || ''}
            className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
            readOnly
          />
        </div>
        <div className='grid w-full md:w-[44%] items-center gap-1.5'>
          <Label htmlFor='longitude'>Longitude</Label>
          <Input
            type='number'
            id='longitude'
            value={location?.lng || ''}
            className='placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
            readOnly
          />
        </div>
      </div>

      <Button
        className='bg-[#f5f5fa] text-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border-none'
        onClick={handleSaveLocation}
      >
        {initialLocation ? 'Update Location' : 'Save Location'}
      </Button>
    </div>
  );
}
