'use client';

import React from 'react';

import SubscriptionCart from '@/components/cartComponents/SubscriptionCart';

const HomePage: React.FC = () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold text-center mb-8'>
        Choose Your Subscription Plan
      </h1>
      <SubscriptionCart />
    </div>
  );
};

export default HomePage;
