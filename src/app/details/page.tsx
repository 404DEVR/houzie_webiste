'use client';




import ItemGrid from '@/components/cards/IconGrid';
import MapCard from '@/components/cards/MapCard';
import PlacesNearby from '@/components/cards/PlacesNearby';
import ProfileCard from '@/components/cards/profilecard';
import PropertyHighlight from '@/components/cards/PropertyHighlights';
import PropertySuggestions from '@/components/cards/PropertySuggestions';
import AboutProperty from '@/components/detailspage/AboutProperty';
import HeaderContainer from '@/components/detailspage/HeaderContainer';
import PropertyDetails from '@/components/detailspage/PropertyDetails';
import PropertyHighlights from '@/components/detailspage/PropertyHighlights';
import ImageGallery from '@/components/imagegrids/ImageGallery';

const amenitiesList = [
    { label: 'Wifi', value: 'WIFI', url: '/svg/wi-fi-icon.svg' },
    { label: 'Power Backup', value: 'POWER_BACKUP', url: '/svg/charge.svg' },
    { label: 'Gym', value: 'GYM', url: '/svg/gym.svg' },
    { label: '4 Wheeler Parking', value: '4_WHEELER_PARKING', url: '/svg/parking.svg' },
    { label: '2 Wheeler Parking', value: '2_WHEELER_PARKING', url: '/svg/parking (1).svg' },
    {
      label: '24/7 Water Supply',
      value: 'WATER_SUPPLY',
      url: '/svg/water supply.svg',
    },
    { label: '24/7 Security', value: 'SECURITY', url: '/svg/security.svg' },
    { label: 'Daily House Keeping', value: 'HOUSE_KEEPING', url: '/svg/house-keeping.svg' },
    {
      label: '24/7 CCTV Surveillance',
      value: 'CCTV',
      url: '/svg/cctv.svg',
    },
    { label: 'Meals', value: 'MEALS', url: '/svg/dinner.svg' },
  ];

export default function DetailsPage() {
  return (
    <>
      <main className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 my-2 sm:my-3 bg-[#F4F4F4]'>
        <HeaderContainer />
        <ImageGallery />

        <div className='mt-4 sm:mt-7 flex flex-col lg:flex-row gap-4'>
          {/* Left column */}
          <div className='w-full flex flex-col lg:w-[65%] xl:w-[70%] order-2 lg:order-1'>
            <PropertyHighlights />
            <PropertyDetails />
            <AboutProperty />

            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <MapCard />
            </div>

            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <ItemGrid items={amenitiesList} title='Amenities' />
            </div>
            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <PlacesNearby />
            </div>
            <div className='space-y-4 sm:space-y-6 mt-4 sm:mt-6'>
              <PropertyHighlight />
            </div>
          </div>

          {/* Right column - Profile Cards */}
          <div className='w-full ml-0 lg:w-[35%] xl:w-[30%] order-1 lg:order-2'>
            <div className='space-y-4'>
              <ProfileCard
                name='Full Name'
                rating={4}
                listingCount={10}
                totalDeals={6}
                memberSince='18 Jan, 2024'
                postedDate='18 Jan, 2025'
                showContact={false}
                avatarUrl='/images/Dummy profile.png'
              />
              <ProfileCard
                name='Full Name'
                rating={4}
                listingCount={10}
                totalDeals={6}
                memberSince='18 Jan, 2024'
                postedDate='18 Jan, 2025'
                phoneNumber='+91 7326941125'
                email='name@gmail.com'
                showContact={true}
                avatarUrl='/images/Dummy profile.png'
              />
            </div>
          </div>
        </div>
        <div className='space-y-4 sm:space-y-6 my-4 sm:my-6'>
          <PropertySuggestions />
        </div>
      </main>
    </>
  );
}
