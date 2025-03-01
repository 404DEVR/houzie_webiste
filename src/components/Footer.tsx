import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsYoutube } from 'react-icons/bs';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa6';
import { RiInstagramFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className='bg-white py-8 relative'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-wrap justify-center text-lg font-semibold text-[#464545] items-center gap-4 sm:gap-8 md:gap-20 text-center mb-6'>
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

        <div className='mt-6 gap-4 sm:gap-8 md:gap-12 text-[#464545] text-center flex flex-wrap justify-center items-center'>
          <p className='text-sm'>© 2021 Houzie, All rights reserved.</p>
          <Link href='#' className='text-sm hover:underline'>
            Legal Notices
          </Link>
          <Link href='#' className='text-sm hover:underline'>
            Confidentiality
          </Link>
          <Link href='#' className='text-sm hover:underline'>
            Credits
          </Link>
        </div>

        <div className='mt-8 flex justify-center space-x-6'>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <FaFacebookF size={20} />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <FaTwitter size={20} />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <RiInstagramFill size={20} />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <FaLinkedinIn size={20} />
          </Link>
          <Link href='#' className='text-blue-500 hover:text-blue-700'>
            <BsYoutube size={20} />
          </Link>
        </div>
      </div>

      <div className='relative w-full'>
        <div
          className='absolute w-full -top-10'
          style={{ paddingBottom: '20%' }}
        >
          <Image
            src='/svg/Container.svg'
            alt='Houzie Logo'
            layout='fill'
            objectFit='contain'
            priority
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
