import { Property } from '@/components/detailspage/HeaderContainer';
import { Check } from 'lucide-react';

const highlights = [
  {
    id: 1,
    title: '24×7 Security',
  },
  {
    id: 2,
    title: 'Security Guards',
  },
  {
    id: 3,
    title: 'Service Lift',
  },
  {
    id: 4,
    title: 'Power Backup',
  },
];

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
            <span className='text-gray-600'>{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
