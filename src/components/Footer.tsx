'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsYoutube } from 'react-icons/bs';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa6';
import { RiInstagramFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className='bg-white py-8 relative'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-wrap justify-center text-sm sm:text-base md:text-lg font-semibold text-[#464545] items-center gap-3 sm:gap-4 md:gap-6 lg:gap-24 text-center mb-6'>
          <Link href='#' className='hover:underline'>
            About
          </Link>
          <Link href='#' className='hover:underline'>
            Concept
          </Link>
          <Link href='#' className='hover:underline'>
            Rent
          </Link>
          <Link href='#' className='hover:underline'>
            Mission
          </Link>
          <Link href='#' className='hover:underline'>
            Resources
          </Link>
          <Link href='#' className='hover:underline'>
            Contact
          </Link>
        </div>

        <div className='mt-4 sm:mt-6 gap-2 sm:gap-4 md:gap-20 text-[#464545] text-center flex flex-wrap justify-center items-center'>
          <p className='text-xs sm:text-sm'>
            © 2021 Houzie, All rights reserved.
          </p>
          <Link href='#' className='text-xs sm:text-sm hover:underline'>
            Legal Notices
          </Link>
          <Link href='#' className='text-xs sm:text-sm hover:underline'>
            Confidentiality
          </Link>
          <Link href='#' className='text-xs sm:text-sm hover:underline'>
            Credits
          </Link>
        </div>

        <div className='mt-6 sm:mt-12 flex justify-center space-x-4 sm:space-x-6'>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <FaFacebookF size={16} className='sm:w-5 sm:h-5' />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <FaTwitter size={16} className='sm:w-5 sm:h-5' />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <RiInstagramFill size={16} className='sm:w-5 sm:h-5' />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <FaLinkedinIn size={16} className='sm:w-5 sm:h-5' />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <BsYoutube size={16} className='sm:w-5 sm:h-5' />
          </Link>
        </div>
      </div>

      <div className='relative w-[90%] mx-auto mt-16 '>
        <div className='absolute w-full' style={{ paddingBottom: '15%' }}>
          <Image
            src='/svg/HOUZIE.svg'
            alt='Houzie Logo'
            layout='fill'
            objectFit='contain'
            priority
          />
        </div>
        <motion.div
          className='absolute bottom-0 right-[18%] sm:right-[19.5%] w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'
          animate={{ y: [0, -40, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1,
            ease: 'easeOut',
          }}
        >
          <Image
            src='/svg/Ellipse 1.svg'
            alt='Additional SVG'
            layout='fill'
            objectFit='contain'
            priority
          />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
