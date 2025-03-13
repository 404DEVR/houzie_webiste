import { OccupantDataProps } from '@/interfaces/PropsInterface';
import React from 'react';

const occupants = [
  {
    id: 1,
    name: 'Name',
    age: 23,
    profession: 'Developer',
    about: '-',
  },
  {
    id: 2,
    name: 'Name',
    age: 23,
    profession: 'Developer',
    about: '-',
  },
  {
    id: 3,
    name: 'Name',
    age: 23,
    profession: 'Developer',
    about: '-',
  },
];

const OccupantData = ({ propertyData }: OccupantDataProps) => {
  return (
    <>
      {propertyData?.occupants && (
        <div className='max-w-4xl mx-auto p-6 rounded-xl bg-white '>
          {/* Title */}
          <h1 className='text-2xl font-bold mb-6'>Current Occupants Profile</h1>

          {/* Occupant Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#f6f6f6]'>
            {propertyData?.occupants.map((occupant, index) => (
              <div
                key={index}
                className='bg-white border rounded-lg shadow-sm p-4 text-gray-700'
              >
                <h2 className='text-lg font-bold mb-2'>Person {index + 1}</h2>
                <p>
                  Name - <span className='font-medium'>{occupant.name}</span>
                </p>
                <p>
                  Age - <span className='font-medium'>{occupant.age}</span>
                </p>
                <p>
                  Profession -{' '}
                  <span className='font-medium'>{occupant.profession}</span>
                </p>
                <p>
                  About - <span className='font-medium'>{occupant.about}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default OccupantData;
