import { useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

import MotionDiv from '@/components/MotionDiv';

const ProcessComponent = () => {
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current; // Capture the current value

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className='max-w-7xl mx-auto py-12 px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row text-center h-full justify-between'>
      <div className='lg:w-1/2 flex items-center justify-center h-full mt-10'>
        <h2 className='text-4xl md:text-5xl lg:text-6xl font-normal leading-none '>
          Our process of<br></br> helping you find your <br></br>home away from
          <br></br>
          home
        </h2>
      </div>

      <div
        ref={ref}
        className='lg:w-1/2 pl-20 flex flex-col justify-center mt-10 lg:mt-0 gap-24 h-full'
      >
        {['Search', 'Find', 'Move'].map((text, index) => (
          <MotionDiv
            key={text}
            custom={index}
            initial='hidden'
            animate={controls}
            variants={itemVariants}
            className='relative pl-5'
          >
            <div className='flex items-center'>
              <div className='w-5 h-5 bg-[#3675ff] rounded-full mr-6'></div>
              <span className='text-4xl md:text-5xl '>{text}</span>
            </div>
            {index < 2 && (
              <div className='absolute left-[30px] h-[95px] border-l-2 border-gray-300'></div>
            )}
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default ProcessComponent;
