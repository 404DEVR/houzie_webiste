import { Check } from 'lucide-react';

import { Property } from '@/components/detailspage/HeaderContainer';

const transformString = (str: string) => {
  if (!str) return '';
  // Replace underscores with spaces and convert to title case
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface PropertyHighlightprops {
  propertyData: Property;
}

export default function PropertyHighlight({
  propertyData,
}: PropertyHighlightprops) {
  return (
    <div className='p-6 bg-white rounded-lg shadow-sm'>
      <h2 className='text-2xl font-semibold mb-4'>Property Highlights</h2>

      <div className='grid grid-cols-2 gap-4'>
        {propertyData.features.map((highlight, index) => (
          <div key={index} className='flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full bg-[#42A4AE] flex items-center justify-center'>
              <Check className='w-3 h-3 text-white' />
            </div>
            <span className='text-gray-600'>{transformString(highlight)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
