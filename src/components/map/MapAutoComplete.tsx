import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  location?: string; // ✅ Added type for searchData
  handleLocationChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlaceAutocomplete = ({
  onPlaceSelect,
  location,
  handleLocationChange,
}: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className='autocomplete-container'>
      <div className='relative flex justify-center items-center bg-[#e0e0e0] px-4 py-2 rounded-md w-full border-none'>
        <MdLocationOn className='h-6 w-6' />
        <input
          type='text'
          placeholder='Enter your office or nearby address'
          className='bg-[#e0e0e0] bg-transparent px-2 w-full border-none text-sm sm:text-md focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 placeholder:text-gray-800'
          ref={inputRef}
          value={location}
          onChange={handleLocationChange}
        />
      </div>
    </div>
  );
};

export default PlaceAutocomplete;
