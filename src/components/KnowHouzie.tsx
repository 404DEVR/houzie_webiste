import { ClipboardEdit, Dock, FileEdit, Navigation2 } from 'lucide-react';

const features = [
  {
    icon: <Navigation2 className='w-8 h-8 ' />,
    title: 'Find Home',
    description:
      "Our properties are located at prime areas where by there won't be problem with transportation",
  },
  {
    icon: <Dock className='w-8 h-8 ' />,
    title: 'Make payments',
    description:
      "Our properties are located at prime areas where by there won't be problem with transportation",
  },
  {
    icon: <ClipboardEdit className='w-8 h-8 ' />,
    title: 'Make payments',
    description:
      "Our properties are located at prime areas where by there won't be problem with transportation",
  },
  {
    icon: <FileEdit className='w-8 h-8 ' />,
    title: 'Make payments',
    description:
      "Our properties are located at prime areas where by there won't be problem with transportation",
  },
];

export default function KnowHouzie() {
  return (
    <div className='max-w-6xl mx-auto px-4 py-16'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold mb-2'>Know Houzie</h2>
        <p className='text-gray-600'>This is how our products works</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='bg-[#E7FDFF] p-6 rounded-lg border-gray-200'
          >
            <div className='bg-[#42A4AE] text-white w-14 h-14 rounded-lg flex items-center justify-center shadow-sm mb-4'>
              {feature.icon}
            </div>
            <h3 className='font-semibold text-lg mb-2'>{feature.title}</h3>
            <p className='text-gray-600 text-sm'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
