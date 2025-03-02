import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import useCountUp from '@/hooks/useCountUp';

const StatsSection: React.FC = () => {
  const [targetSatisfactionRate, setTargetSatisfactionRate] = useState(0);
  const [targetPropertiesAvailable, setTargetPropertiesAvailable] = useState(0);
  const [targetSatisfiedCustomers, setTargetSatisfiedCustomers] = useState(0);
  const [targetCities, setTargetCities] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const satisfactionRate = useCountUp(targetSatisfactionRate);
  const propertiesAvailable = useCountUp(targetPropertiesAvailable);
  const satisfiedCustomers = useCountUp(targetSatisfiedCustomers);
  const cities = useCountUp(targetCities);

  const description =
    'Houzie is revolutionizing the rental market by providing a seamless marketplace for brokers and renters. We empower renters with access to a vast inventory of verified properties and intuitive search tools. Brokers benefit from increased visibility and efficient lead generation. With a high satisfaction rate, a growing number of properties, satisfied customers, and expanding city coverage, Houzie is the future of rental connections.';

  useEffect(() => {
    const getRandomNumber = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    if (inView) {
      setTargetSatisfactionRate(getRandomNumber(90, 99));
      setTargetPropertiesAvailable(getRandomNumber(40, 60));
      setTargetSatisfiedCustomers(getRandomNumber(40, 60));
      setTargetCities(getRandomNumber(20, 40));
    }
  }, [inView]);

  const numberVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  return (
    <div ref={ref} className='bg-white py-12'>
      <div className='max-w-[90%] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:grid lg:grid-cols-5 lg:gap-8'>
          <motion.div
            className='grid grid-cols-2 gap-16 col-span-2'
            variants={textVariants}
            initial='hidden'
            animate={inView ? 'visible' : 'hidden'}
          >
            <div>
              <motion.p
                className='text-7xl font-medium text-black'
                variants={numberVariants}
              >
                {satisfactionRate}
                <span className='text-blue-600'>%</span>
              </motion.p>
              <p className='mt-1 text-lg text-gray-500'>Satisfaction Rate</p>
            </div>
            <div>
              <motion.p
                className='text-7xl font-medium text-black'
                variants={numberVariants}
              >
                {propertiesAvailable}
                <span className='text-blue-600'>+</span>
              </motion.p>
              <p className='mt-1 text-lg text-gray-500'>Properties Available</p>
            </div>
            <div>
              <motion.p
                className='text-7xl font-medium text-black'
                variants={numberVariants}
              >
                {satisfiedCustomers}
                <span className='text-blue-600'>+</span>
              </motion.p>
              <p className='mt-1 text-lg text-gray-500'>Satisfied Customers</p>
            </div>
            <div>
              <motion.p
                className='text-7xl font-medium text-black'
                variants={numberVariants}
              >
                {cities}
              </motion.p>
              <p className='mt-1 text-lg text-gray-500'>Cities</p>
            </div>
          </motion.div>
          <motion.div
            className='mt-8 lg:mt-0 lg:col-span-3'
            variants={textVariants}
            initial='hidden'
            animate={inView ? 'visible' : 'hidden'}
          >
            <p className='text-lg text-gray-700'>{description}</p>
            <button className='mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center'>
              Our Services
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
