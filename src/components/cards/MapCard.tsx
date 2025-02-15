import Image from 'next/image';
import { TiLocation } from 'react-icons/ti';

export default function MapCard() {
  return (
    <div className='p-4 sm:p-6 bg-white rounded-lg shadow-sm w-full mx-auto'>
      <h2 className='text-2xl font-semibold'>Places nearby</h2>
      <div className='flex items-center gap-2 text-sm mt-1'>
        <TiLocation size={20} />
        <span className='text-gray-600'>Block D, Sector 27, Noida</span>
      </div>
      <div className='mt-4 overflow-x-auto'>
        <div className='relative w-full h-[300px]'>
          <Image
            src='/images/Container.png'
            alt='Map of Block D, Sector 27, Noida'
            layout='fill'
            objectFit='cover'
            className='rounded-lg'
          />
        </div>
      </div>
      <span className='text-gray-600 mt-4'>
        We verified that this listing’s location is accurate.{' '}
        <span className='underline '>Learn more</span>
      </span>
    </div>
  );
}
