'use client';

export default function NearbyAmenities() {
  const nearbyData = [
    { label: 'School', distance: '0.7 km' },
    { label: 'University', distance: '1.3 km' },
    { label: 'Grocery center', distance: '0.6 km' },
    { label: 'Market', distance: '1.1 km' },
    { label: 'Hospital', distance: '0.4 km' },
    { label: 'Metro station', distance: '1.8 km' },
    { label: 'Gym, wellness', distance: '1.3 km' },
    { label: 'River', distance: '2.1 km' },
  ];

  return (
    <div className='w-full py-4 bg-white'>
      <h2 className='text-2xl font-medium text-[#3a414e] mb-4'>
        What's Nearby?
      </h2>
      <p className='text-gray-600 text-sm mb-6'>
        Explore nearby amenities to precisely locate your property and identify
        surrounding conveniences, providing a comprehensive overview of the
        living environment and the property's convenience.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-[60%]'>
        <div className='flex flex-col justify-start items-start gap-4 text-gray-800'>
          {nearbyData.slice(0, 4).map((item, index) => (
            <div key={index} className='flex justify-between w-48'>
              <span className='font-normal text-[#adb0b2]'>{item.label}:</span>
              <span>{item.distance}</span>
            </div>
          ))}
        </div>
        <div className='flex flex-col justify-start items-start gap-4 text-gray-800'>
          {nearbyData.slice(4, 8).map((item, index) => (
            <div key={index} className='flex justify-between w-48'>
              <span className='font-normal text-[#adb0b2]'>{item.label}:</span>
              <span>{item.distance}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
