'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className='fixed inset-0 flex items-center justify-center '>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 relative'>
        <div className='flex flex-col items-center text-center'>
          <div className='w-24 h-24 mb-4'>
            <Image
              src='/svg/succcess.svg'
              alt='Success'
              width={200}
              height={200}
              priority
            />
          </div>

          <div className='flex items-center gap-2 text-[#5CC1B1] mb-4'>
            <Image
              src='/svg/logo light.svg'
              alt='Houzie'
              width={100}
              height={100}
            />
          </div>

          <h2 className='text-xl font-semibold mb-3'>Connection Successful!</h2>
          <p className='text-gray-600 text-sm mb-6'>
            you have successfully connected with the broker. they will contact
            you shortly to discuss the property details.
          </p>

          <Button
            size='custom'
            onClick={() => router.push('/')}
            className='w-full bg-[#5CC1B1] hover:bg-[#4BA99B] text-white py-2 rounded-md transition-colors'
          >
            Okay
          </Button>
        </div>
      </div>
    </div>
  );
}
