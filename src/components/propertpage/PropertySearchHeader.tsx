import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function PropertySearchHeader() {
  const router = useRouter();
  return (
    <div className='flex flex-col px-4 lg:flex-row items-start lg:items-center gap-3 mb-4'>
      <h2 className='text-2xl font-semibold'>
        20 Properties | Property near (location)
      </h2>
      <div className='flex gap-3'>
        <Button
          onClick={() => router.push('/')}
          size='custom'
          className='border-[#42A4AE] text-[#42A4AE] py-2 px-8 border rounded-xl hover:bg-accent hover:text-accent-foreground'
        >
          Edit Search
        </Button>
        <Button
          size='custom'
          className='bg-[#42A4AE] text-white hover:bg-[#3a959e]  py-2 px-8 rounded-xl'
        >
          Save Search
        </Button>
      </div>
    </div>
  );
}
