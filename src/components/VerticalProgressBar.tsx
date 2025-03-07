'use client';

import { Check } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import { ProgressBarProps } from '@/interfaces/PropsInterface';

const VerticalProgressBar: React.FC<ProgressBarProps> = ({
  checkpoints,
  currentpage,
  totalPages,
  setCurrentPage,
  page,
}) => {
  const handleCircleClick = (checkpoint) => {
    setCurrentPage(checkpoint.placement);
  };

  return (
    <div className='bg-white rounded-lg p-4 shadow-md h-[300px] hidden md:block'>
      <div className='relative w-full mx-auto h-full'>
        <div className='flex flex-col items-start h-full'>
          {checkpoints.map((checkpoint, index) => {
            const stepNumber = index + 1;
            const isCompleted = checkpoint.placement < currentpage;
            const isCurrent = checkpoint.placement === currentpage;

            return (
              <div key={index} className='flex flex-col items-start'>
                <div className=' flex gap-2 justify-center items-center '>
                  <div
                    onClick={() => handleCircleClick(checkpoint)}
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center  ',
                      isCompleted
                        ? 'bg-[#1e5faf] text-white'
                        : isCurrent
                        ? 'bg-[#1e5faf] text-white'
                        : 'bg-[#646464] text-gray-500'
                    )}
                  >
                    {isCompleted && <Check className='w-4 h-4' />}
                  </div>
                  <div
                    className={cn(
                      ' text-sm text-start font-medium  text-nowrap',
                      isCompleted
                        ? 'text-[#1e5faf]'
                        : isCurrent
                        ? 'text-[#1e5faf]'
                        : 'text-gray-800'
                    )}
                  >
                    {checkpoint.label}
                  </div>
                </div>

                {index < checkpoints.length - 1 && (
                  <div
                    className={cn(
                      'w-1 h-24 mb-2 ml-2',
                      isCompleted ? 'bg-[#1e5faf]' : 'bg-[#646464]'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerticalProgressBar;
