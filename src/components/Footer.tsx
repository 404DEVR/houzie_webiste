'use client';
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className='bg-[#42A4AE] text-white'>
      <div className='container mx-auto px-6 py-12'>
        <div className='flex flex-col lg:flex-row gap-12'>
          <div className='lg:w-1/4 space-y-4 flex-[1]'>
            <div className='flex items-center gap-2'>
              <Image
                src='/svg/logo-house.svg'
                alt='Houzie Logo'
                width={32}
                height={32}
                className='object-contain'
              />
              <span className='text-2xl font-semibold'>Houzie</span>
            </div>
            <p className='text-sm text-white/90'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit aliquam
              mauris sed ma
            </p>
            <div className='flex gap-4'>
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map(
                (Icon, index) => (
                  <Button
                    key={index}
                    variant='ghost'
                    size='icon'
                    className='bg-white hover:bg-white/90 rounded-lg p-2 w-10 h-10 flex items-center justify-center'
                  >
                    <Icon className='h-5 w-5 text-[#42A4AE]' />
                  </Button>
                )
              )}
            </div>
          </div>

          <div className='lg:w-1/5 flex flex-[2] justify-between lg:justify-around'>
            <div className='space-y-4'>
              <h3 className='font-semibold'>How It Work</h3>
              <ul className='space-y-2'>
                <li>
                  <Link href='#' className='hover:underline'>
                    Buyer profile
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:underline'>
                    Renter Tool
                  </Link>
                </li>
              </ul>
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold'>Links</h3>
              <ul className='space-y-2'>
                <li>
                  <Link href='#' className='hover:underline'>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:underline'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:underline'>
                    FAQ's
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='lg:w-[55%] space-y-4 flex-[2]'>
            <h3 className='font-semibold text-2xl text-center lg:text-right'>
              Have something to talk about with our professionals?
            </h3>
            <div className='relative max-w-md w-full mx-auto lg:mx-0'>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Your email here'
                className='bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-12 border-white'
              />
              <Button
                size='icon'
                variant='ghost'
                className='absolute right-0 top-0 h-full hover:bg-white/10'
              >
                <ArrowRight className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>

        <Separator className='my-8 bg-white' />

        <div className='text-center text-sm text-white/90'>
          <p>Copyright © 2023 | All Rights Reserved |</p>
        </div>
      </div>
    </footer>
  );
}
