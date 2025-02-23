'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const PaymentFailure = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get('order_id');

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='bg-white shadow-md rounded-lg p-8 max-w-md mx-auto'>
        <h1 className='text-3xl font-bold mb-4 text-red-600'>Payment Failed</h1>
        <p className='text-lg mb-4'>
          We're sorry, but your payment could not be processed.
        </p>
        {order_id && (
          <p className='mb-2'>
            Order ID: <strong>{order_id}</strong>
          </p>
        )}
        <div className='mt-6 space-y-4'>
          <Link
            href='/'
            className='w-full border bg-[#42A4AE] rounded-lg px-6 text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
          >
            Continue to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
