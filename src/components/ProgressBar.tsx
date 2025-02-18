'use client';

import React from 'react';

interface Checkpoint {
  label: string;
  placement: number;
}

interface ProgressBarProps {
  checkpoints: Checkpoint[];
  currentpage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  page: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  checkpoints,
  currentpage,
  setCurrentPage,
  totalPages,
  page,
}) => {
  const handlecircel = (checkpoint: Checkpoint) => {
    setCurrentPage(checkpoint.placement);
  };

  const calculateProgressValue = () => {
    if (page === 'edit') {
      // Optimize for three points in edit mode
      switch (currentpage) {
        case 1:
          return 30;
        case 2:
          return 70;
        case 3:
          return 100;
        default:
          return 0;
      }
    } else {
      // Original calculation for other pages
      return (currentpage / (totalPages - 1)) * 100;
    }
  };

  const progressValue = calculateProgressValue();

  return (
    <div className='relative w-full mx-auto mt-4 mb-8 md:mt-8 md:mb-16'>
      <div className='h-1 md:h-2 bg-gray-200 rounded-full overflow-hidden relative'>
        <div
          className='h-full bg-[#00C52E] transition-all duration-300 ease-in-out'
          style={{ width: `${progressValue}%` }}
        ></div>
      </div>
      <div className='flex justify-between items-start w-full absolute top-0 left-0 transform -translate-y-2 md:-translate-y-3'>
        {checkpoints.map((checkpoint, index) => {
          const isCompleted = checkpoint.placement < currentpage;
          const isCurrent = checkpoint.placement === currentpage;
          const isPending = checkpoint.placement > currentpage;

          const circleColor = isCompleted
            ? 'bg-[#00C52E]'
            : isCurrent
            ? 'bg-[#00C52E] text-black'
            : 'bg-[#EFF0F6]';

          const circleText = isCompleted
            ? 'text-white'
            : isCurrent
            ? 'text-white'
            : 'text-black';

          const statusLabel = isCompleted
            ? 'Completed'
            : isCurrent
            ? 'In Progress'
            : 'Pending';

          const statusformat = isCompleted
            ? 'text-[#00C52E] bg-[#BDFFA4]'
            : isCurrent
            ? 'text-[#0033FF] bg-[#CFE7FE]'
            : 'text-[#6F6C8F] bg-[#EFF0F6]';

          return (
            <div
              key={index}
              className='flex flex-col items-center justify-start w-1/5 text-center'
            >
              <div
                onClick={() => handlecircel(checkpoint)}
                className={`w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full ${circleColor} ${circleText} flex items-center justify-center cursor-pointer mb-1 md:mb-2 text-xs md:text-sm`}
              >
                {checkpoint.placement}
              </div>
              <h1 className='font-semibold leading-tight text-[0.6rem] sm:text-xs md:text-sm text-gray-800 h-6 mb-1 md:mb-2'>
                {checkpoint.label}
              </h1>
              <p
                className={`text-[0.6rem] sm:text-xs ${statusformat} mt-1 rounded-lg px-2 py-1 md:px-4 md:py-2`}
              >
                {statusLabel}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
