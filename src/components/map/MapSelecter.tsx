import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
} from '@react-google-maps/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import CustomInput from '@/components/inputs/CustomInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Location } from '@/interfaces/Interface';
import { MapLocationSelectorProps } from '@/interfaces/PropsInterface';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  city: '',
  state: '',
  country: '',
  lat: 28.4595,
  lng: 77.0266,
};

function MapSelecter({
  onLocationSave,
  initialLocation = null,
}: MapLocationSelectorProps) {
  const [location, setLocation] = useState<Location>(() => {
    const storedLocation = localStorage.getItem('userLocation');
    return storedLocation
      ? JSON.parse(storedLocation)
      : initialLocation ?? defaultCenter;
  });
  const [markerAnimation, setMarkerAnimation] = useState<
    google.maps.Animation | undefined
  >(undefined);

  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  const [locationTitle, setLocationTitle] = useState('');
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || '',
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      map.setCenter(location);
    },
    [location]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Reverse Geocoding to Get City, State, and Country
  const getPlaceDetails = (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const place = results[0];
        let newCity = '';
        let newState = '';
        let newCountry = '';

        place.address_components.forEach((component) => {
          if (component.types.includes('locality')) {
            newCity = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            newState = component.long_name;
          }
          if (component.types.includes('country')) {
            newCountry = component.long_name;
          }
        });

        setLocation((prev) => ({
          ...prev,
          city: newCity,
          state: newState,
          country: newCountry,
        }));
      }
    });
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        city: '',
        state: '',
        country: '',
      };

      setMarkerAnimation(google.maps.Animation.BOUNCE);
      setLocation(newLocation);
      getPlaceDetails(newLocation.lat, newLocation.lng);
      setTimeout(() => setMarkerAnimation(undefined), 1000);
    }
  };

  const handleSaveLocation = () => {
    onLocationSave(location);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const formattedValue = value;
    setLocationTitle(formattedValue);
  };

  const handleInputLocation = () => {
    if (inputRef.current) {
      const address = inputRef.current.getPlaces();
      console.log(address);
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      setLocation(parsedLocation);
      if (map) {
        map.panTo(parsedLocation);
        getPlaceDetails(parsedLocation.lat, parsedLocation.lng);
      }
    }
  }, [map]);

  return isLoaded ? (
    <>
      <div className='mb-4'>
        <StandaloneSearchBox
          onLoad={(ref) => (inputRef.current = ref)}
          onPlacesChanged={handleInputLocation}
        >
          <CustomInput
            label='Type Address'
            type='text'
            name='locationTitle'
            id='locationTitle'
            value={locationTitle}
            onChange={handleInputChange}
            className={cn(
              'placeholder:text-[#646464] text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
            )}
            placeholder='Enter Your Address'
            required
          />
        </StandaloneSearchBox>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={12}
        onClick={handleMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={location} animation={markerAnimation} />
      </GoogleMap>

      <div className='flex flex-wrap gap-6 my-4'>
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
    </>
  ) : null;
}

export default React.memo(MapSelecter);
