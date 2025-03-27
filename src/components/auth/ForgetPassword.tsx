'use client';

import { ChevronRight, Lock, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const handleForgotLink = async () => {
    if (!email.trim()) {
      setFieldErrors({ email: 'Please enter an email' });
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch('https://api.houzie.in/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep(2);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!token || !userId) {
      setFieldErrors({ token: 'Invalid reset link' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://api.houzie.in/auth/verify-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId }),
      });
      if (res.ok) {
        setStep(3);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password.trim()) {
      setFieldErrors({ password: 'Please enter a new password' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://api.houzie.in/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId, newPassword: password }),
      });
      if (res.ok) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-auto w-full py-40'>
      <CardHeader className='space-y-1 flex flex-col items-center p-2'>
        <CardTitle className='text-3xl md:text-4xl text-center mb-8'>
          {step === 1
            ? 'Forgot Password'
            : step === 2
            ? 'Verify Token'
            : 'Reset Password'}
        </CardTitle>
      </CardHeader>
      <CardContent className='w-[90%] md:w-[80%] mx-auto p-0'>
        <form className='grid gap-4'>
          {step === 1 && (
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email Address</Label>
              <div className='relative'>
                <Mail className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                <Input
                  id='email'
                  placeholder='hello@example.com'
                  type='email'
                  className='pl-8'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {fieldErrors['email'] && (
                <p className='text-red-500 text-sm'>{fieldErrors['email']}</p>
              )}
            </div>
          )}
          {step === 3 && (
            <div className='grid gap-2'>
              <Label htmlFor='password'>New Password</Label>
              <div className='relative'>
                <Lock className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter new password'
                  className='pl-8'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {fieldErrors['password'] && (
                <p className='text-red-500 text-sm'>
                  {fieldErrors['password']}
                </p>
              )}
            </div>
          )}
        </form>
        <div className='flex flex-col gap-2 justify-center items-center mt-6'>
          {step === 1 && (
            <Button
              onClick={handleForgotLink}
              className='bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-4'
              disabled={loading}
            >
              {loading ? (
                'Sending...'
              ) : (
                <div className='flex gap-1 justify-center items-center'>
                  <p>Send Password Reset Link</p>
                  <ChevronRight />
                </div>
              )}
            </Button>
          )}
          {step === 2 && (
            <Button
              onClick={handleVerifyToken}
              className='bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-4'
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Token'}
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleResetPassword}
              className='bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-4'
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
          <Button
            size='custom'
            onClick={() => setStep(1)}
            className='text-[#3b82f6]'
          >
            Back to Login
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
