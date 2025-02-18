'use client';

import { Icon } from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
}

interface MapLocationDisplayProps {
  location: Location;
}

export default function MapLocationDisplay({
  location,
}: MapLocationDisplayProps) {
  const defaultLocation: Location = location; // Mumbai, Maharashtra, India

  return (
    <div className='h-[400px] w-full'>
      <MapContainer
        center={defaultLocation}
        zoom={13}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker
          position={defaultLocation}
          icon={
            new Icon({
              iconUrl:
                'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        />
      </MapContainer>
    </div>
  );
}
