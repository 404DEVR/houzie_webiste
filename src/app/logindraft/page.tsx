'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { useUserStore } from '@/store/userIdStore';

import { AUTH_API_URL } from '@/constant/authUrl';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUserId, userId } = useUserStore();

  const handleInitiateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${AUTH_API_URL}auth/login/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setUserId(data.userId); // Store userId in Zustand
      setStep(2);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        userId,
        otp,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/'); // Redirect to dashboard on success
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Sign In</h2>
          {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
        </div>

        {step === 1 ? (
          <form onSubmit={handleInitiateLogin} className='mt-8 space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
                placeholder='Enter your email'
                disabled={loading}
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className='mt-8 space-y-6'>
            <div>
              <label
                htmlFor='otp'
                className='block text-sm font-medium text-gray-700'
              >
                Enter OTP
              </label>
              <input
                id='otp'
                type='text'
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
                placeholder='Enter OTP'
                disabled={loading}
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
