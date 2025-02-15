import CityGrid from '@/components/imagegrids/LocalitiesGrid';
import { Button } from '@/components/ui/button';

export default function DiscoverProperties() {
  return (
    <div className='max-w-6xl mx-auto px-4 py-12 '>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6'>
        <div className='max-w-2xl'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Discover Properties on Houzie
          </h2>
          <p className='text-gray-600'>
            Explore a variety of homes for Rent, view authentic neighborhood
            images, read resident testimonials, and discover local insights to
            find the perfect fit for you.
          </p>
        </div>

        <Button className='bg-[#5CC1B1] hover:bg-[#4BA99B] text-white px-6 py-2.5 rounded-md transition-colors'>
          View All Properties
        </Button>
      </div>
      <CityGrid normal={false} />
    </div>
  );
}
