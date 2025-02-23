'use client';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  removeSubscription,
  selectSelectedSubscription,
} from '@/redux/slices/subscriptionSlice';
import useAuth from '@/hooks/useAuth';

const CartPage = () => {
  const { auth } = useAuth();
  const selectedSubscription = useSelector(selectSelectedSubscription);
  const dispatch = useDispatch();
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [cashfree, setCashfree] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState('cashfree');

  useEffect(() => {
    const initializeCashfree = async () => {
      const cashfreeInstance = await load({
        mode: 'sandbox',
      });
      setCashfree(cashfreeInstance);
    };

    initializeCashfree();
  }, []);

  useEffect(() => {
    if (paymentSessionId && cashfree && selectedGateway === 'cashfree') {
      handleCashfreePayment();
    }
  }, [paymentSessionId, cashfree, selectedGateway]);

  const handleRemove = () => {
    dispatch(removeSubscription());
  };

  const createOrder = async () => {
    try {
      if (selectedGateway === 'cashfree') {
        const response = await axios.post('/api/create-order', {
          amount: selectedSubscription?.price,
          email: auth?.email || 'customer@example.com',
          phone: auth?.phoneNumber || '9999999999',
        });
        setPaymentSessionId(response.data.paymentSessionId);
        console.log(response.data);
      } else if (selectedGateway === 'payu') {
        handlePayUPayment();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleCashfreePayment = async () => {
    if (!cashfree || !paymentSessionId) return;

    const checkoutOptions = {
      paymentSessionId: paymentSessionId,
      returnUrl: `${window.location.origin}/payment-success?order_id={order_id}`,
    };

    try {
      const result = await cashfree.checkout(checkoutOptions);

      if (result.error) {
        console.error('Payment error:', result.error.message);
        window.location.href = `${window.location.origin}/payment-failure`;
        return;
      }

      if (result.redirect) {
        console.log('Redirecting to payment page...');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      window.location.href = `${window.location.origin}/payment-failure`;
    }
  };

  const handlePayUPayment = async () => {
    try {
      const txnid = `TXN_${Date.now()}`;

      const response = await axios.post('/api/generate-hash', {
        txnid: txnid,
        amount: selectedSubscription?.price,
        productinfo: selectedSubscription?.name,
        firstname: auth?.name || 'John',
        email: auth?.email || 'john@example.com',
      });

      if (response.data.error) {
        console.error('Error generating hash:', response.data.error);
        return;
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://test.payu.in/_payment';

      const params = {
        key: process.env.NEXT_PUBLIC_PAYU_KEY,
        txnid: txnid,
        amount: selectedSubscription?.price,
        productinfo: selectedSubscription?.name,
        firstname: auth?.name || 'John',
        email: auth?.email || 'john@example.com',
        phone: auth?.phoneNumber || '9999999999',
        surl: `${window.location.origin}/payment-success`,
        furl: `${window.location.origin}/payment-failure`,
        hash: response.data.hash,
      };

      for (const key in params) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error initiating PayU payment:', error);
    }
  };

  if (!selectedSubscription) {
    return (
      <div className='container mx-auto mt-10'>
        <div className='flex shadow-md my-10'>
          <div className='w-full bg-white px-10 py-10'>
            <div className='flex justify-between border-b pb-8'>
              <h1 className='font-semibold text-2xl'>Shopping Cart</h1>
              <h2 className='font-semibold text-2xl'>0 Items</h2>
            </div>
            <div className='flex mt-10'>
              <h3 className='text-sm underline'>
                <Link href='/'>Continue Shopping</Link>
              </h3>
            </div>
            <h2 className='font-semibold text-2xl mt-10'>
              Your cart is empty!
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto mt-10'>
      <div className='flex shadow-md my-10'>
        <div className='w-3/4 bg-white px-10 py-10'>
          <div className='flex justify-between border-b pb-8'>
            <h1 className='font-semibold text-2xl'>Cart</h1>
            <h2 className='font-semibold text-2xl'>1 Item</h2>
          </div>
          <div className='flex mt-10 mb-5'>
            <h3 className='font-semibold text-gray-600 text-xs uppercase w-2/5'>
              Product Details
            </h3>
            <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>
              Quantity
            </h3>
            <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>
              Price
            </h3>
            <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>
              Total
            </h3>
          </div>

          <div className='flex items-center hover:bg-gray-100 -mx-8 px-6 py-5'>
            <div className='flex w-2/5'>
              <div className='flex flex-col justify-between ml-4 flex-grow'>
                <span className='font-bold text-sm'>
                  {selectedSubscription.name}
                </span>
                <span
                  className='text-red-500 text-xs cursor-pointer'
                  onClick={handleRemove}
                >
                  Remove
                </span>
              </div>
            </div>

            <span className='text-center w-1/5 font-semibold text-sm'>1</span>
            <span className='text-center w-1/5 font-semibold text-sm'>
              ₹{selectedSubscription.price}
            </span>
            <span className='text-center w-1/5 font-semibold text-sm'>
              ₹{selectedSubscription.price}
            </span>
          </div>

          <Link
            href='/'
            className='flex font-semibold text-sm text-indigo-500 mt-10'
          >
            <svg
              className='fill-current mr-2 text-indigo-500 w-4'
              viewBox='0 0 448 512'
            >
              <path d='M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z' />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div id='summary' className='w-1/4 px-8 py-10'>
          <h1 className='font-semibold text-2xl border-b pb-8'>
            Order Summary
          </h1>
          <div className='flex justify-between mt-10 mb-5'>
            <span className='font-semibold text-sm uppercase'>Items 1</span>
            <span className='font-semibold text-sm'>
              ₹{selectedSubscription.price}
            </span>
          </div>
          <div className='mb-4'>
            <Select
              onValueChange={setSelectedGateway}
              defaultValue={selectedGateway}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Payment Gateway' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='cashfree'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src='/svg/cashfree.svg'
                      width={20}
                      height={20}
                      alt='Description of the image'
                    />
                    Cashfree
                  </div>
                </SelectItem>
                <SelectItem value='payu'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src='/svg/payu.svg'
                      width={20}
                      height={20}
                      alt='Description of the image'
                    />
                    PayU
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className='w-full border bg-[#42A4AE] rounded-lg px-6 text-white hover:bg-white hover:text-[#42A4AE] transition-colors'
            onClick={createOrder}
          >
            {selectedGateway === 'cashfree'
              ? 'Pay with Cashfree'
              : 'Pay with PayU'}
          </Button>
        </div>
        {/* {paymentSessionId && (
          <p className='mt-4 text-sm text-gray-600'>
            Payment Session ID: {paymentSessionId}
          </p>
        )} */}
      </div>
    </div>
  );
};

export default CartPage;
