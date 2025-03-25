import { useEffect, useState } from 'react';

const GURUGRAM_LAT = 28.4595;
const GURUGRAM_LNG = 77.0266;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const useLocationTracker = (checkInterval = 60000) => {
  const [isNearGurugram, setIsNearGurugram] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(true);

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const distance = calculateDistance(
              latitude,
              longitude,
              GURUGRAM_LAT,
              GURUGRAM_LNG
            );
            if (distance <= 100) {
              setIsNearGurugram(true);
              localStorage.setItem(
                'userLocation',
                JSON.stringify({ lat: latitude, lng: longitude })
              );
            } else {
              setIsNearGurugram(false);
              localStorage.removeItem('userLocation');
            }
            setLocationChecked(true);
            setPermissionGranted(true);
          },
          (error) => {
            console.error('Error fetching location:', error.message);
            setIsNearGurugram(false);
            localStorage.removeItem('userLocation');
            setLocationChecked(true);
            setPermissionGranted(error.code !== 1);
          }
        );
      } else {
        setLocationChecked(true);
        setPermissionGranted(false);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, checkInterval);
    return () => clearInterval(interval);
  }, [checkInterval]);

  return {
    isNearGurugram,
    setIsNearGurugram,
    locationChecked,
    permissionGranted,
  };
};
