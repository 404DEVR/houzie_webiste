'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const PaymentStatus = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams.get('order_id');
  const [status, setStatus] = useState('Initiating payment verification...');

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!order_id) {
        setStatus('Order ID not found. Redirecting to failure page...');
        setTimeout(() => router.push('/payment-failure'), 2000);
        return;
      }

      try {
        setStatus('Verifying payment status...');
        const response = await axios.get(
          `/api/payment-status?order_id=${order_id}`
        );

        if (response.data.order_status === 'PAID') {
          setStatus('Payment successful! Redirecting...');
          setTimeout(
            () => router.push(`/payment-success?order_id=${order_id}`),
            2000
          );
        } else {
          setStatus('Payment unsuccessful. Redirecting to failure page...');
          setTimeout(
            () => router.push(`/payment-failure?order_id=${order_id}`),
            2000
          );
        }
      } catch (error) {
        console.error('Error verifying payment status:', error);
        setStatus('Error occurred. Redirecting to failure page...');
        setTimeout(() => router.push('/payment-failure'), 2000);
      }
    };

    verifyPaymentStatus();
  }, [router, order_id]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='p-8 bg-white rounded-lg shadow-md text-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
        <h1 className='text-2xl font-bold mb-4'>Payment Verification</h1>
        <p className='text-gray-600'>{status}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
