import { Check, X } from 'lucide-react';
import React from 'react';

const ComparisonTable: React.FC = () => {
  const features = [
    'Proximity First Search',
    'All Rental Types',
    'Smart Filters',
    '100% Verified Properties',
    'Full Transparency',
  ];

  return (
    <>
      <div className='overflow-x-auto rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='hidden sm:block'>
          {' '}
          {/* Table for larger screens */}
          <table className='min-w-full divide-y divide-gray-200 rounded-lg'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 text-center text-sm sm:text-base md:text-lg font-medium bg-[#cbb3ff] uppercase tracking-wider'
                >
                  Features
                </th>
                <th
                  scope='col'
                  className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 text-center text-sm sm:text-base md:text-lg font-medium text-white bg-[#3675ff] uppercase tracking-wider'
                >
                  Houzie
                </th>
                <th
                  scope='col'
                  className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 text-center text-sm sm:text-base md:text-lg font-medium text-black bg-[#ff764d] uppercase tracking-wider'
                >
                  Other Platforms
                </th>
              </tr>
            </thead>
            <tbody className='bg-[#cbb3ff] divide-y divide-gray-200'>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td className='px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-base sm:text-xl md:text-2xl whitespace-nowrap font-medium text-gray-900'>
                    {feature}
                  </td>
                  <td className='px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-sm text-gray-500 text-center bg-[#3675ff]'>
                    <div className='rounded-sm bg-black inline-flex items-center justify-center p-1'>
                      <Check className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white' />
                    </div>
                  </td>
                  <td className='px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-sm text-gray-500 text-center bg-[#ff764d]'>
                    <div className='rounded-sm bg-black inline-flex items-center justify-center p-1'>
                      <X className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='sm:hidden'>
          {' '}
          {/* Column layout for small screens */}
          <div className='bg-[#cbb3ff] rounded-lg overflow-hidden'>
            <div className='px-4 py-3 text-lg font-medium bg-[#cbb3ff] uppercase tracking-wider text-center'>
              Features
            </div>
            {features.map((feature, index) => (
              <div
                key={index}
                className='px-4 py-3 text-base font-medium text-gray-900 border-t border-gray-200'
              >
                {feature}
              </div>
            ))}
          </div>
          <div className='mt-4 bg-[#3675ff] rounded-lg overflow-hidden'>
            <div className='px-4 py-3 text-lg font-medium text-white uppercase tracking-wider text-center'>
              Houzie
            </div>
            {features.map((_, index) => (
              <div
                key={index}
                className='px-4 py-3 text-center border-t border-gray-200'
              >
                <div className='rounded-sm bg-black inline-flex items-center justify-center p-1'>
                  <Check className='h-5 w-5 text-white' />
                </div>
              </div>
            ))}
          </div>
          <div className='mt-4 bg-[#ff764d] rounded-lg overflow-hidden'>
            <div className='px-4 py-3 text-lg font-medium text-black uppercase tracking-wider text-center'>
              Other Platforms
            </div>
            {features.map((_, index) => (
              <div
                key={index}
                className='px-4 py-3 text-center border-t border-gray-200'
              >
                <div className='rounded-sm bg-black inline-flex items-center justify-center p-1'>
                  <X className='h-5 w-5 text-white' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='text-center mt-16 sm:mt-20 md:mt-28 mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-4'>
          Your Next Rental Made Easy
        </h1>
      </div>
    </>
  );
};

export default ComparisonTable;
