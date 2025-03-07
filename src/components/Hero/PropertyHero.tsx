import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import MotionDiv from '@/components/MotionDiv';
import SearchBar from '@/components/SearchBar/SearchBar';

export default function PropertyHero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setIsVideoLoaded(true);
      });
    }
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div
      id='hero'
      className='relative min-h-[650px] flex items-center justify-center'
    >
      <div className='absolute inset-0 -z-10'>
        {!isVideoLoaded && (
          <Image
            src='/svg/hero image.svg'
            alt='Modern living room'
            fill
            priority
            loading='eager'
            className='object-cover brightness-[0.85]'
            quality={100}
          />
        )}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`object-cover w-full h-full brightness-[0.85] ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500`}
        >
          <source src='/video/hero video.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className='container mx-auto px-4 mt-32 md:mt-48 mb-10'>
        <MotionDiv
          className='text-center mb-8'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <MotionDiv
            className='text-[60px] lg:text-[90px] font-normal leading-none md:leading-snug text-[#DBDBDB]'
            variants={textVariants}
          >
            Find. Move. Settle.
          </MotionDiv>
          <MotionDiv
            className='text-[60px] lg:text-[100px] leading-none md:leading-snug mx-auto text-white'
            variants={textVariants}
          >
            Renting Simplified!
          </MotionDiv>
        </MotionDiv>

        <SearchBar />
      </div>
    </div>
  );
}
