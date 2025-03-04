'use client';

import { Check } from 'lucide-react';
import React from 'react';

import { ProgressBarProps } from '@/interfaces/PropsInterface';

const ProgressBar: React.FC<ProgressBarProps> = ({
  checkpoints,
  currentpage,
  totalPages,
  setCurrentPage,
  page,
}) => {
  const handlecircel = (checkpoint) => {
    setCurrentPage(checkpoint.placement);
  };

  const calculateProgressValue = () => {
    if (page === 'edit') {
      switch (currentpage) {
        case 1:
          return 50;
        case 2:
          return 100;
        default:
          return 0;
      }
    } else {
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
    }
  };

  const progressValue = calculateProgressValue();

  return (
    <div className='relative w-full mx-auto mt-4 md:hidden mb-8'>
      <div className='h-1 w-full md:h-64 md:w-2 bg-[#b4b3b3] rounded-full overflow-hidden relative'>
        <div
          className='w-full h-full md:w-full md:absolute md:bottom-0 bg-[#1e5faf] transition-all duration-300 ease-in-out'
          style={{
            width: `${progressValue}%`,
          }}
        ></div>
      </div>

      <div className='flex md:flex-col justify-between items-start w-full absolute top-0 left-0 transform -translate-y-2 md:translate-y-6'>
        {checkpoints.map((checkpoint, index) => {
          const isCompleted = checkpoint.placement < currentpage;
          const isCurrent = checkpoint.placement === currentpage;

          const circleColor = isCompleted
            ? 'bg-[#1e5faf] '
            : isCurrent
            ? 'bg-[#1e5faf] '
            : 'bg-[#b4b3b3] ';

          const circleText = isCompleted
            ? 'text-white'
            : isCurrent
            ? 'text-white'
            : 'text-black';

          // const statusLabel = isCompleted
          //   ? 'Completed'
          //   : isCurrent
          //   ? 'In Progress'
          //   : 'Pending';

          // const statusformat = isCompleted
          //   ? 'text-[#1e5faf] bg-[#BDFFA4]'
          //   : isCurrent
          //   ? 'text-[#0033FF] bg-[#CFE7FE]'
          //   : 'text-[#6F6C8F] bg-[#EFF0F6]';

          return (
            <div
              key={index}
              className='flex flex-col md:flex-row md:w-full md:gap-4 items-center justify-start w-1/5 text-center'
            >
              <div
                // onClick={() => handlecircel(checkpoint)}
                className={` rounded-full ${circleColor} ${circleText} text-black w-5 h-5 md:h-6 md:w-6 flex items-center justify-center mb-1 md:mb-2 text-xs md:text-sm p-1`}
              >
                {isCompleted ? <Check /> : isCurrent ? <></> : <></>}
              </div>
              <h1 className='font-semibold leading-tight text-[0.6rem] sm:text-xs md:text-sm text-gray-800 h-6 mb-1 md:mb-2'>
                {checkpoint.label}
              </h1>
              {/* <p
                className={`text-[0.6rem] sm:text-xs ${statusformat} mt-1 rounded-lg px-2 py-1 md:px-4 md:py-2`}
              >
                {statusLabel}
              </p> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
