'use client';

import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const faqs = [
  {
    question: 'Who can use Houzie?',
    answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
  {
    question: 'What is Houzie?',
    answer:
      'Houzie is a property listing and selling platform that connects property owners, buyers, renters, and real estate agents. Users can list properties for sale or rent, search for available properties, and communicate directly through the platform.',
  },
  {
    question: 'Is Houzie free to use?',
    answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
  {
    question: 'How do I create an account?',
    answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
];

const blogPosts = {
  main: {
    title: 'Home Rents Are Falling Fast in These 10 Renty and Popular Cities',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Congue eros pharetra lectus vitae tortor molla massa. Condimentum cursitor mollis in vestibule, viverra auctor donec. Maximus pellenteur eu ante; odio aenean integer nibh.',
    longDescription:
      'Parturient sodales condimentum habitasse himenaeos convallis mattis quis ac. Ut a ultrices consequat potenti imperdiet et. Phellum elit dictum mollis vehicula velit lectus dictum tristique.',
    image: '/images/Frame 165.png',
  },
  sidePosts: [
    {
      title: 'Lorem ipsum',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      image: '/images/Frame 84.png',
    },
    {
      title: 'Lorem ipsum',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      image: '/images/home.png',
    },
    {
      title: 'Lorem ipsum',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      image: '/images/house.png',
    },
    {
      title: 'Lorem ipsum',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      image: '/images/appartment.png',
    },
    {
      title: 'Lorem ipsum',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      image: '/images/bulding.png',
    },
  ],
};

export default function FAQsAndBlogs() {
  const [activeSection, setActiveSection] = useState<'faqs' | 'blogs' | null>(
    null
  );
  const [openFAQ, setOpenFAQ] = useState<number | null>(1);

  return (
    <div className='max-w-6xl mx-auto px-4 py-16'>
      <div className='flex gap-4 justify-center'>
        <button
          onClick={() => setActiveSection('faqs')}
          className={`transition-all duration-500 ease-in-out flex items-center gap-2 bg-[#5CC1B1] text-white px-6 py-2 rounded-md hover:bg-[#4BA99B] ${
            activeSection === 'faqs' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          FAQ's <ChevronDown />
        </button>
        <button
          onClick={() => setActiveSection('blogs')}
          className={`transition-all duration-500 ease-in-out flex items-center gap-2 bg-[#5CC1B1] text-white px-6 py-2 rounded-md hover:bg-[#4BA99B] ${
            activeSection === 'blogs' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Blogs <ChevronDown />
        </button>
      </div>

      {/* FAQs Section */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          activeSection === 'faqs'
            ? 'opacity-100 h-auto mt-8'
            : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>
              Frequently Asked Questions
            </h2>
            <p className='text-gray-600'>
              Lorem ipsum dolor sit amet consectetur adipiscing elit ultrices
            </p>
          </div>
          <button
            onClick={() => setActiveSection(null)}
            className='bg-[#5CC1B1] text-white px-6 py-2 rounded-md flex items-center gap-2'
          >
            FAQ's <ChevronUp />
          </button>
        </div>

        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-lg transition-colors duration-300 ${
                openFAQ === index ? 'bg-[#E6F7F5]' : 'bg-gray-50'
              }`}
            >
              <button
                className='w-full px-6 py-4 flex justify-between items-center'
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <span className='font-medium'>{faq.question}</span>
                {openFAQ === index ? (
                  <X className='w-5 h-5 text-[#5CC1B1]' />
                ) : (
                  <Plus className='w-5 h-5' />
                )}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFAQ === index ? 'max-h-40' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className='px-6 pb-4'>
                  <p className='text-gray-600'>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blogs Section */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          activeSection === 'blogs'
            ? 'opacity-100 h-auto mt-8'
            : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>Blogs</h2>
            <p className='text-gray-600'>
              Lorem ipsum dolor sit amet consectetur adipiscing elit ultrices
            </p>
          </div>
          <button
            onClick={() => setActiveSection(null)}
            className='bg-[#5CC1B1] text-white px-6 py-2 rounded-md flex items-center gap-2'
          >
            Blogs <ChevronUp />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            <div className='relative h-[400px] mb-4'>
              <Image
                src={blogPosts.main.image}
                alt={blogPosts.main.title}
                fill
                className='object-cover rounded-lg'
              />
            </div>
            <h3 className='text-2xl font-bold mb-4'>{blogPosts.main.title}</h3>
            <div className='space-y-4 text-gray-600'>
              <p>{blogPosts.main.description}</p>
              <p>{blogPosts.main.longDescription}</p>
            </div>
          </div>

          <div className='space-y-4'>
            {blogPosts.sidePosts.map((post, index) => (
              <div key={index} className='flex gap-4'>
                <div className='relative w-24 h-24 flex-shrink-0'>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className='object-cover rounded-lg'
                  />
                </div>
                <div>
                  <h4 className='font-medium mb-1'>{post.title}</h4>
                  <p className='text-sm text-gray-600'>{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
