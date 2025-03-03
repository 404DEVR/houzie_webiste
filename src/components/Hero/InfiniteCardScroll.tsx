import { ScalableImageCard } from '@/components/cards/ScalableImageCard';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface Property {
  name: string;
  location: string;
  imageUrl: string;
}

const properties: Property[] = [
  {
    name: 'Celestial Heights',
    location: 'Skyline Ridge, Mountain View',
    imageUrl: '/images/skyscrapers-sunset.png',
  },
  {
    name: 'Urban Loft',
    location: 'Downtown, City Center',
    imageUrl:
      '/images/vertical-cityscape-with-tall-skyscrapers-new-york-usa.png',
  },
  {
    name: 'Sunset Villa',
    location: 'Coastal Bluffs, Malibu',
    imageUrl:
      '/images/amazing-shot-us-flag-park-manhattan-skyline-background 1.png',
  },
  {
    name: 'Mountain Retreat',
    location: 'Alpine Valley, Aspen',
    imageUrl: '/images/new-york-cityscape 1.png',
  },
  {
    name: 'Lakeside Cottage',
    location: 'Serene Lake, Tahoe',
    imageUrl: '/images/chicago-urban-aerial-view-dusk 1.png',
  },
  {
    name: 'Desert Oasis',
    location: 'Arid Plains, Scottsdale',
    imageUrl:
      '/images/beautiful-view-empire-states-skyscrapers-new-york-city.png',
  },
  {
    name: 'Baton Rouge ',
    location: 'Lon Angeles, California',
    imageUrl: '/images/new-york-skycraper-sunset-usa.png',
  },
];

const InfiniteCardScroll: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 320 + 16;
  const numberOfCards = properties.length;
  const duplicatedProperties = [...properties, ...properties, ...properties];
  const totalCards = duplicatedProperties.length;

  useEffect(() => {
    const calculateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    calculateContainerWidth();

    window.addEventListener('resize', calculateContainerWidth);

    return () => {
      window.removeEventListener('resize', calculateContainerWidth);
    };
  }, []);

  const calculateAnimationDistance = () => {
    return -(cardWidth * numberOfCards);
  };

  const blurWidth = 200;

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className='py-8 relative overflow-hidden'
      ref={sectionRef}
      variants={fadeInVariants}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div
        className='absolute left-0 top-0 h-full bg-gradient-to-r from-white to-transparent z-10'
        style={{ width: `${blurWidth}px`, pointerEvents: 'none' }}
      />
      <div
        className='absolute right-0 top-0 h-full bg-gradient-to-l from-white to-transparent z-10'
        style={{ width: `${blurWidth}px`, pointerEvents: 'none' }}
      />
      <motion.div
        className='flex overflow-x-hidden'
        style={{ width: `${cardWidth * totalCards}px` }}
        animate={{
          x: [0, calculateAnimationDistance()],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 15,
            ease: 'linear',
          },
        }}
      >
        {duplicatedProperties.map((property, index) => (
          <div
            key={index}
            className='flex-shrink-0 mx-2 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]'
          >
            <ScalableImageCard
              {...property}
              className='h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px]'
            />
            <div className='mt-2 py-1 px-2'>
              <h3 className='text-lg sm:text-xl md:text-2xl font-medium'>
                {property.name}
              </h3>
              <p className='text-gray-600 flex text-sm items-center mt-1'>
                <span className='mr-1 text-gray-800'>•</span>
                {property.location}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default InfiniteCardScroll;
