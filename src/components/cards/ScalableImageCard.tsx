import Image from 'next/image';

import { Card } from '@/components/ui/card';

interface ScalableImageCardProps {
  name: string;
  imageUrl: string;
  className?: string;
}

export function ScalableImageCard({
  name,
  imageUrl,
  className = '',
}: ScalableImageCardProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className='absolute inset-0 overflow-hidden'>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className='object-cover transition-transform duration-300 ease-in-out hover:scale-110'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
      <div className='absolute top-4 left-4 px-4 py-2 bg-gray-800/60 rounded-md'>
        <span className='text-white text-lg font-medium'>{name}</span>
      </div>
    </Card>
  );
}
