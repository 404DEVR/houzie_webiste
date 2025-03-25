'use client';

import { useAnimation, useInView } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react';

import MotionDiv from '@/components/MotionDiv'; // Import the MotionDiv component
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const tooltipContent = {
    verifiedProperties: 'Browse only verified properties for peace of mind.',
    extensiveInventory:
      'Discover a wide range of rental options to find the perfect fit.',
    proximitySearch: 'Find properties near your desired location with ease.',
    lifestyleFilters:
      'Customize your search with filters tailored to your preferences.',
    getStarted: 'Begin your journey to find the perfect rental property.',
  };

  return (
    <TooltipProvider>
      <div id='feature' className='pt-12 md:pt-28 px-4 sm:px-6 lg:px-8'>
        <MotionDiv // Use MotionDiv
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={controls}
          className='max-w-7xl mx-auto relative h-[400px] sm:h-[500px] md:h-[600px] w-full rounded-3xl overflow-hidden'
        >
          <Image
            src='/svg/Features Background.svg'
            alt='Background Image'
            layout='fill'
            objectFit='cover'
            priority
          />
          <div className='absolute inset-0 bg-black opacity-20'></div>

          <MotionDiv // Use MotionDiv
            variants={itemVariants}
            className='absolute top-24 md:top-20 left-8 md:left-8'
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='bg-white text-nowrap text-gray-800 text-sm sm:text-lg md:text-2xl h-8 sm:h-10 md:h-12 rounded-full py-1 pr-1 pl-3 sm:pl-4 md:pl-6 font-medium shadow-md hover:bg-gray-100 flex items-center justify-center'>
                  Verified Properties
                  <div className='text-black relative right-0 text-xs sm:text-sm md:text-lg font-medium rounded-full px-2 sm:px-3 py-1 sm:py-2 border border-black ml-2 sm:ml-4 md:ml-6 h-full flex items-center justify-center'>
                    <MoveUpRight />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                className='bg-white text-gray-700 shadow-md rounded-md p-3 text-sm border-none'
                sideOffset={5}
              >
                {tooltipContent.verifiedProperties}
              </TooltipContent>
            </Tooltip>
          </MotionDiv>

          <MotionDiv // Use MotionDiv
            variants={itemVariants}
            className='absolute top-8 sm:top-16 md:top-20 right-8 md:right-8'
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='bg-white text-nowrap text-gray-800 text-sm sm:text-lg md:text-2xl h-8 sm:h-10 md:h-12 rounded-full py-1 pr-1 pl-3 sm:pl-4 md:pl-6 font-medium shadow-md hover:bg-gray-100 flex items-center justify-center'>
                  Extensive Inventory
                  <div className='text-black relative right-0 text-xs sm:text-sm md:text-lg font-medium rounded-full px-2 sm:px-3 py-1 sm:py-2 border border-black ml-2 sm:ml-4 md:ml-6 h-full flex items-center justify-center'>
                    <MoveUpRight />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                className='bg-white text-gray-700 shadow-md rounded-md p-3 text-sm border-none'
                sideOffset={5}
              >
                {tooltipContent.extensiveInventory}
              </TooltipContent>
            </Tooltip>
          </MotionDiv>

          <MotionDiv // Use MotionDiv
            variants={itemVariants}
            className='absolute top-[55%] left-[30%] sm:left-[55%] transform -translate-x-1/2 -translate-y-1/2'
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='bg-white text-nowrap text-gray-800 text-sm sm:text-lg md:text-2xl h-8 sm:h-10 md:h-12 rounded-full py-1 pr-1 pl-3 sm:pl-4 md:pl-6 font-medium shadow-md hover:bg-gray-100 flex items-center justify-center'>
                  Proximity Search
                  <div className='text-black relative right-0 text-xs sm:text-sm md:text-lg font-medium rounded-full px-2 sm:px-3 py-1 sm:py-2 border border-black ml-2 sm:ml-4 md:ml-6 h-full flex items-center justify-center'>
                    <MoveUpRight />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                className='bg-white text-gray-700 shadow-md rounded-md p-3 text-sm border-none'
                sideOffset={5}
              >
                {tooltipContent.proximitySearch}
              </TooltipContent>
            </Tooltip>
          </MotionDiv>

          <MotionDiv // Use MotionDiv
            variants={itemVariants}
            className='absolute bottom-8 sm:bottom-10 md:bottom-20 right-2 sm:right-8 md:right-12'
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='flex text-nowrap justify-between bg-white text-gray-800 text-sm sm:text-lg md:text-2xl h-8 sm:h-10 md:h-12 rounded-full py-1 pr-1 pl-3 sm:pl-4 md:pl-6 font-medium shadow-md hover:bg-gray-100 items-center '>
                  Lifestyle Filters
                  <div className='text-black relative right-0 text-xs sm:text-sm md:text-lg font-medium rounded-full px-2 sm:px-3 py-1 sm:py-2 border border-black ml-2 sm:ml-4 md:ml-6 h-full flex items-center justify-center'>
                    <MoveUpRight />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                className='bg-white text-gray-700 shadow-md rounded-md p-3 text-sm border-none'
                sideOffset={5}
              >
                {tooltipContent.lifestyleFilters}
              </TooltipContent>
            </Tooltip>
          </MotionDiv>

          <MotionDiv // Use MotionDiv
            variants={itemVariants}
            className='hidden md:absolute bottom-4 sm:bottom-8 md:bottom-10 left-4 sm:left-8 md:left-10 rounded-3xl bg-white p-4 sm:p-6 md:p-8 h-[40%] w-[45%] md:w-1/2 shadow-lg'
          >
            <Badge className='bg-[#cbb3ff] text-black rounded-full px-2 sm:px-3 md:px-4 py-1 text-xs sm:text-sm md:text-md font-medium'>
              Features
            </Badge>

            <h2 className='text-2xl sm:text-3xl md:text-5xl font-normal mb-4 sm:mb-6 md:mb-10 mt-2 sm:mt-3 md:mt-4'>
              Features
            </h2>
            <div className='flex'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className='bg-blue-500 hover:bg-blue-600 text-black text-sm sm:text-lg md:text-2xl h-8 sm:h-10 md:h-12 font-medium rounded-full py-2 sm:py-3 px-4 sm:px-6 md:px-8 flex items-center justify-center'>
                    Get Started
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className='bg-white text-gray-700 shadow-md rounded-md p-3 text-sm border-none'
                  sideOffset={5}
                >
                  {tooltipContent.getStarted}
                </TooltipContent>
              </Tooltip>
              <div className='hidden md:flex bg-blue-500 hover:bg-blue-600 text-black text-xs sm:text-sm md:text-lg font-medium rounded-full px-2 sm:px-3 py-1 sm:py-2 justify-center items-center'>
                <MoveUpRight />
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>
        <div className='text-center mt-10 sm:mt-20 md:mt-28'>
          <h1 className='text-3xl md:text-5xl lg:text-6xl font-normal'>
            Houzie Services
          </h1>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HeroSection;
