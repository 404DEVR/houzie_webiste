import { LocateIcon, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { MdEmail } from 'react-icons/md';

const ContactForm = () => {
  return (
    <div className='flex max-w-6xl mx-auto flex-col md:flex-row items-center justify-center my-4 p-8 rounded-lg shadow-xl'>
      {/* Left Section - Form */}
      <div className='w-full md:w-1/2 py-4 px-16'>
        <h2 className='text-2xl font-bold text-[#1d71d8] mb-2'>Get in touch</h2>
        <p className='text-gray-600 mb-6'>
          We are here for you! How can we help?
        </p>
        <form>
          <div className='mb-4'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              className='mt-1 block w-full px-3 py-2 border-2 border-[#1d71d8] rounded-md shadow-sm focus:ring-[#1d71d8] focus:border-[#1d71d8] sm:text-sm'
              placeholder='Your Name'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              className='mt-1 block w-full px-3 py-2 border-2 border-[#1d71d8] rounded-md shadow-sm focus:ring-[#1d71d8] focus:border-[#1d71d8]sm:text-sm'
              placeholder='Your Email'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-700'
            >
              Message
            </label>
            <textarea
              id='message'
              name='message'
              rows={4}
              className='mt-1 block w-full px-3 py-2 border-2 border-[#1d71d8] rounded-md shadow-sm focus:ring-[#1d71d8] focus:border-[#1d71d8] sm:text-sm'
              placeholder='Your Message'
            ></textarea>
          </div>
          <button
            type='submit'
            className='w-full bg-[#1d71d8] text-white py-2 px-4 rounded-md hover:bg-[#1d71d8] focus:outline-none focus:ring focus:ring-blue-300'
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Section - Image and Contact Info */}
      <div className='w-full md:w-1/2 p-4 flex flex-col items-center justify-center'>
        {/* Next.js Image */}
        <Image
          src='/svg/contactUs.svg' // Replace with your image path
          alt='Contact Illustration'
          width={350}
          height={350}
          priority
        />
        {/* Contact Info */}
        <div className='mt-6 flex flex-col gap-2 justify-start items-start'>
          <div className='flex justify-start items-start gap-2 '>
            <MapPin className='text-[#1d71d8]' />
            <p className='text-gray-600'>Manjeet's flat, Gurgaon</p>
          </div>
          <div className='flex justify-start items-start gap-2 '>
            <Phone className='text-[#1d71d8]' />
            <p className='text-gray-600'>+91 897776764</p>
          </div>
          <div className='flex justify-start items-start gap-2 '>
            <Mail className='text-[#1d71d8]' />
            <p className='text-gray-600'>hello@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
