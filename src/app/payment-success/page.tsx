'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get('order_id');

  return (
    <div className='container mx-auto px-4 py-10'>
      <h1 className='text-3xl font-bold mb-4'>Payment Successful!</h1>
      <p className='text-lg mb-2'>Thank you for your payment.</p>
      <p>
        Your order ID is: <strong>{order_id}</strong>
      </p>
      <div className='mt-6'>
        <a
          href='/'
          className='w-full border bg-[#42A4AE] rounded-lg px-6 text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
        >
          Continue to Home
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
