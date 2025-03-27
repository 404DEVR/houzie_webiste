import { NextRequest, NextResponse } from 'next/server';

// Haversine formula to calculate distance between two coordinates
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const types =
      searchParams.get('types') || 'restaurant,school,subway_station'; // Default types
    const radius = searchParams.get('radius') || '5000'; // Default 5km radius

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and Longitude are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;
    const typeList = types.split(',');

    const nearestPlaces: Record<string, any> = {};

    // Fetch places for each type
    for (const type of typeList) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Calculate distances
        const placesWithDistance = data.results.map((place: any) => {
          const placeLat = place.geometry.location.lat;
          const placeLng = place.geometry.location.lng;
          return {
            ...place,
            distance: haversineDistance(lat, lng, placeLat, placeLng),
          };
        });

        // Find the nearest place of this type
        placesWithDistance.sort((a, b) => a.distance - b.distance);
        nearestPlaces[type] = placesWithDistance[0]; // Closest place of this type
      } else {
        nearestPlaces[type] = null; // No places found for this type
      }
    }

    return NextResponse.json({ nearestPlaces });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
