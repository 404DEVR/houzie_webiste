'use client';

import { Icon } from 'leaflet';
import { useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Location {
  lat: number;
  lng: number;
}

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

interface MapLocationSelectorProps {
  onLocationSave: (location: Location) => void;
  initialLocation?: Location | null;
}

export default function MapLocationSelector({
  onLocationSave,
  initialLocation = null,
}: MapLocationSelectorProps) {
  const [location, setLocation] = useState<Location | null>(initialLocation);

  const handleSaveLocation = () => {
    if (location) {
      onLocationSave(location);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='h-[400px] w-full'>
        <MapContainer
          center={location || [0, 0]}
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
            readOnly
          />
        </div>
        <div className='grid w-full md:w-[44%] items-center gap-1.5'>
          <Label htmlFor='longitude'>Longitude</Label>
          <Input
            type='number'
            id='longitude'
            value={location?.lng || ''}
            readOnly
          />
        </div>
      </div>

      <Button
        variant='outline'
        className='hover:bg-[#42A4AE] hover:text-white'
        onClick={handleSaveLocation}
      >
        {initialLocation ? 'Update Location' : 'Save Location'}
      </Button>
    </div>
  );
}
