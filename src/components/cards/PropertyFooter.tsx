import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';

const PropertyFooter = () => {
  return (
    <div className='flex flex-col md:flex-row items-center justify-start gap-4 md:gap-16  max-w-7xl mx-auto'>
      {/* Left Section: Image */}
      <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-6'>
        <Image
          src='/svg/PropertyFooter.svg'
          alt='Detective Icon'
          width={200}
          height={200}
          priority
          className='w-full h-auto'
        />
      </div>

      {/* Right Section: Text and Button */}
      <div className='flex flex-col items-start text-start'>
        <h2 className='text-2xl lg:text-5xl font-bold text-gray-800 mb-2'>
          Can't find what you are <br></br>looking for?
        </h2>
        <p className='text-gray-600 mb-4 text-sm md:text-base lg:text-3xl font-semibold'>
          Get alerts for new matching properties...
        </p>
        <Button
          size='custom'
          className='bg-blue-500 text-white flex justify-between py-1 px-4 rounded-md hover:bg-blue-600'
        >
          Enquire Now <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default PropertyFooter;
