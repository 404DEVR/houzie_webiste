'use client';

import { useAnimation } from 'framer-motion';
import { ArrowRight, House } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import MotionDiv from '@/components/MotionDiv';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HeroText = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <div className='text-center mt-16 sm:mt-24 md:mt-32 px-4'>
        <p className='text-4xl md:text-7xl font-normal md:mb-3'>
          Find Home
          <Image
            src='/svg/small house 1.svg'
            alt='Home'
            width={90}
            height={50}
            priority
            className='inline-block mx-2 rounded-full object-cover w-16 h-12 md:w-20 md:h-16'
          />
          close to work
        </p>
        <p className='text-4xl md:text-7xl font-normal flex flex-wrap justify-center items-center md:mb-4'>
          with zero hassle
          <div className='flex justify-center items-center text-white  p-3 md:p-5 bg-[#ff764d] rounded-full mx-2 my-2'>
            <House className='h-5 w-5 md:h-6 md:w-6' />
          </div>
          and
        </p>
        <p className='text-4xl md:text-7xl font-normal'>
          full transparency
          <Image
            src='/svg/small house 2.svg'
            alt='Transparency'
            width={90}
            height={50}
            priority
            className='inline-block mx-2 rounded-full object-cover  w-16 h-12 md:w-20 md:h-16'
          />
        </p>
      </div>
      <div
        className='max-w-7xl mx-auto mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 px-4'
        ref={ref}
      >
        <MotionDiv
          variants={cardVariants}
          initial='hidden'
          animate={controls}
          className='h-full'
        >
          <Card className='relative rounded-3xl overflow-hidden shadow-lg h-[350px] lg:h-full'>
            <CardContent className='relative p-0 z-0 bg-[#ff764d] h-full'>
              <Image
                src='/svg/background Building.svg'
                alt='Building'
                width={800}
                height={600}
                priority
                className='absolute inset-0 object-cover  '
              />
              <div className='relative flex flex-col h-full justify-between px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16'>
                <CardTitle className='text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-4'>
                  Renting Made Easy.
                </CardTitle>
                <MotionDiv
                  className='bg-white text-gray-800 font-normal text-base sm:text-lg md:text-xl py-2 sm:py-3 md:py-4 rounded-full flex justify-between items-center space-x-2 hover:bg-gray-100'
                  initial={{ paddingLeft: 16, paddingRight: 16 }}
                  whileHover={{ paddingLeft: 24, paddingRight: 24 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <span className='font-medium'>Explore all services</span>
                  <ArrowRight className='h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8' />
                </MotionDiv>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>

        <MotionDiv variants={cardVariants} initial='hidden' animate={controls}>
          <Card className='bg-[#4169E1] rounded-3xl overflow-hidden shadow-lg  h-[350px] lg:h-full'>
            <CardHeader className='p-4 sm:p-6 md:p-8'>
              <CardTitle className='text-2xl font-normal text-white mb-2'>
                Features
              </CardTitle>
              <CardDescription className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-4 sm:mb-6'>
                Forget random location based searches. Just enter your office
                location, set a search radius, and find the perfect home-fast
                and easy.
              </CardDescription>
            </CardHeader>
            <CardFooter className='flex flex-wrap gap-2 p-4 sm:p-6 md:p-8'>
              <Badge
                variant='outline'
                className='text-xs md:text-lg px-4 py-2 text-white border'
              >
                Affordable
              </Badge>
              <Badge
                variant='outline'
                className='text-xs md:text-lg px-4 py-2 text-white border'
              >
                Searchable
              </Badge>
              <Badge
                variant='outline'
                className='text-xs md:text-lg px-4 py-2 text-white border'
              >
                Proximal
              </Badge>
            </CardFooter>
          </Card>
        </MotionDiv>
      </div>
      <div className='text-center mt-10 sm:mt-20 md:mt-28 mb-4 sm:mb-12 md:mb-16 px-4'>
        <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal'>
          Rent Smarter With Houzie
        </h1>
      </div>
    </>
  );
};

export default HeroText;
