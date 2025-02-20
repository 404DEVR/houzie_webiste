'use client';

import L from 'leaflet';
import { useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import 'leaflet/dist/leaflet.css';

import { updateAddPropertyLocation } from '@/redux/slices/formslices';
import { AppDispatch, RootState } from '@/redux/store';

const customIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationSelector = () => {
  const dispatch = useDispatch<AppDispatch>();
  const propertyLocation = useSelector(
    (state: RootState) => state.addForm.propertyLocation
  );
  const [position, setPosition] = useState<[number, number]>(
    propertyLocation.latitude && propertyLocation.longitude
      ? [propertyLocation.latitude, propertyLocation.longitude]
      : [19.076, 72.8777] // Default to Mumbai
  );

  // const LocationMarker = () => {
  //   useMapEvents({
  //     click(e) {
  //       const { lat, lng } = e.latlng;
  //       setPosition([lat, lng]);
  //       dispatch(updateAddPropertyLocation({ latitude: lat, longitude: lng }));
  //     },
  //   });
  //   return position ? <Marker position={position} icon={customIcon} /> : null;
  // };

  return (
    <div className='w-full h-64 rounded-md overflow-hidden'>
      {/* <MapContainer center={position} zoom={13} className='w-full h-full'>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker />
      </MapContainer> */}
    </div>
  );
};

export default LocationSelector;
