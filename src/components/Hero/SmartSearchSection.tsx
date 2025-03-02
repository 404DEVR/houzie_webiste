import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import MotionDiv from '@/components/MotionDiv';

interface AccordionItem {
  title: string;
  description?: string;
  image: string;
}

const SmartSearch: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number | null>(0);
  const [accordionHeight, setAccordionHeight] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const accordionData: AccordionItem[] = [
    {
      title: 'Smart Search',
      description:
        'Add your office location, select radius. Apply filters and find verified homes that match your needs— right location, within budget, no bias, no spam.',
      image: '/svg/Accordian Image.svg',
    },
    {
      title: 'Explore & Compare',
      description:
        'See transparent pricing on rent, maintenance, security deposit, and brokerage.',
      image: '/svg/accordian2.svg',
    },
    {
      title: 'Connect With Brokers',
      description:
        'Reach out directly, schedule visits, and get complete details.',
      image: '/svg/accordian3.svg',
    },
    {
      title: 'Move With Confidence',
      description:
        'Trusted listings, no hidden charges—renting made easy for professionals like you.',
      image: '/svg/accordian4.svg',
    },
    {
      title: 'Start Your Search Today',
      description: 'Start Searching',
      image: '/svg/accordian5.svg',
    },
  ];

  const toggleSection = (index: number) => {
    setActiveSection(activeSection === index ? null : index);
  };

  useEffect(() => {
    if (accordionRef.current) {
      setAccordionHeight(accordionRef.current.offsetHeight);
    }
  }, [activeSection]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <MotionDiv
        id='services'
        ref={sectionRef}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className='max-w-7xl mx-auto flex flex-col lg:flex-row items-start bg-gray-50 rounded-3xl overflow-hidden pt-28'
      >
        <div ref={accordionRef} className='w-full lg:w-1/2 p-8'>
          {accordionData.map((item, index) => (
            <MotionDiv
              key={index}
              className={`${index === 4 ? 'mb-0 ' : 'mb-12'}`}
              variants={itemVariants}
            >
              <div
                className='flex items-center justify-between py-2 cursor-pointer'
                onClick={() => toggleSection(index)}
              >
                <h3 className='text-3xl font-medium'>{item.title}</h3>
                {activeSection === index ? (
                  <FaMinus className='text-2xl' />
                ) : (
                  <FaPlus className='text-2xl' />
                )}
              </div>
              <MotionDiv
                ref={(el: any) => (contentRefs.current[index] = el)}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: activeSection === index ? 'auto' : 0,
                  opacity: activeSection === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='mt-2 text-gray-600 overflow-hidden'
              >
                {item.description}
              </MotionDiv>
            </MotionDiv>
          ))}
        </div>

        <MotionDiv
          className='w-full max-w-[90%] mx-auto lg:w-1/2 relative'
          variants={itemVariants}
          style={{ height: accordionHeight }}
        >
          <AnimatePresence mode='wait'>
            <MotionDiv
              key={activeSection}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.1 }}
              className='absolute inset-0'
            >
              <Image
                src={
                  accordionData[activeSection !== null ? activeSection : 0]
                    .image
                }
                alt='Accordion Image'
                layout='fill'
                objectFit='cover'
                className='rounded-3xl'
              />
            </MotionDiv>
          </AnimatePresence>
        </MotionDiv>
      </MotionDiv>
      <div className='text-center max-w-[90%] mx-auto mt-28 mb-16'>
        <Button
          variant='default'
          className='bg-[#4169E1] text-white py-0 rounded-full mb-4'
        >
          Properties
        </Button>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-normal mb-4'>
          Why Houzie?
        </h1>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-normal'>
          Because Renting Should Be Easy
        </h1>
      </div>
    </>
  );
};

export default SmartSearch;
