import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectSelectedSubscription,
  selectSubscription,
} from '@/redux/slices/subscriptionSlice';

interface Subscription {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const SubscriptionCart: React.FC = () => {
  const router = useRouter();
  const selectedSubscription = useSelector(selectSelectedSubscription);
  const dispatch = useDispatch();

  const premiumSubscription: Subscription = {
    id: 'premium',
    name: 'Premium',
    price: 199,
    description:
      'Scale your reach with unlimited listings and priority support.',
    features: [
      'Unlimited listings',
      'Detailed performance analytics',
      '24/7 Priority Support',
    ],
  };

  useEffect(() => {
    // Dispatch the action to select the premium subscription by default
    dispatch(selectSubscription(premiumSubscription));
  }, [dispatch]);

  return (
    <div className='flex justify-center items-center p-4'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border-2 border-[#41a2ac]'>
        <div className='bg-[#5cc1b1] py-6 px-8'>
          <h3 className='text-2xl font-semibold text-white text-center'>
            Upgrade Your Plan
          </h3>
          <div className='text-center mt-2'>
            <span className='text-4xl font-bold text-[#f0f8ff]'>
              ₹{premiumSubscription.price}
            </span>
            <span className='text-[#e0f0ea]'>/month</span>
          </div>
        </div>

        <ul className='px-6 py-4 border-t'>
          {premiumSubscription.features.map((feature, index) => (
            <li key={index} className='flex items-center py-2'>
              <svg
                className='w-5 h-5 mr-2 text-green-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              <span className='text-gray-700'>{feature}</span>
            </li>
          ))}
        </ul>

        <div className='px-6 py-4'>
          <button
            className='block w-full text-center py-3 rounded-md font-semibold text-white bg-gray-800 hover:bg-gray-900 transition-colors duration-300'
            onClick={() => router.push('/cart')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCart;
