import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CardProps {
  label: string;
  description: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ label, description, className }) => {
  return (
    <div
      className={cn(
        'rounded-[60px] pt-12 pb-6 px-6 flex flex-col items-start justify-between h-full',
        className
      )}
    >
      <span className='text-2xl md:text-4xl mb-4 text-start '>{label}</span>
      <motion.button
        className='bg-white w-full text-gray-800 font-normal text-xl py-4 rounded-full flex justify-between items-center space-x-2 hover:bg-gray-100'
        initial={{ paddingLeft: 16, paddingRight: 16 }}
        whileHover={{ paddingLeft: 24, paddingRight: 24 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <span className='font-medium'>{description}</span>
        <ArrowRight className='h-8 w-8 text-2xl' />
      </motion.button>
    </div>
  );
};

const HeroSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      className='py-12 rounded-3xl max-w-[90%] sm:max-w-7xl mx-auto w-full mt-20'
      style={{
        background: '#729eff',
      }}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <div className='px-4 sm:px-6 lg:px-8 flex flex-col w-full sm:max-w-[85%] mx-auto items-center'>
        <motion.h2
          className='text-4xl lg:text-5xl  font-normal  text-white mb-8 text-center'
          variants={cardVariants}
        >
          Ready For a New Property Search Experience?
        </motion.h2>
        <div className='w-full flex flex-col sm:flex-row gap-6 justify-center'>
          <motion.div variants={cardVariants} className='w-full sm:w-1/2 '>
            <Card
              label='Explore Properties'
              description='Explore'
              className='bg-[#FF7F50] text-white'
            />
          </motion.div>
          <motion.div variants={cardVariants} className='w-full sm:w-1/2'>
            <Card
              label='Post Property'
              description='Post Properties'
              className='bg-[#4169E1] text-white'
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
