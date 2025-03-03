'use client';

import 'leaflet/dist/leaflet.css';

const LocationSelector = () => {
  // const propertyLocation = useSelector(
  //   (state: RootState) => state.addForm.propertyLocation
  // );

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
