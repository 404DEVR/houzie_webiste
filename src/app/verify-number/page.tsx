'use client';

import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import CustomInput from '@/components/inputs/CustomInput';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

const VerifyNumber = () => {
  const toast = useCustomToast();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [otp, setOtp] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPhoneNumber(value);

    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleInitiateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch(`https://api.houzie.in/auth/login/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setUserId(data.userId);
      setStep(3);
    } catch (error) {
      console.log(error);
      setFieldErrors({});
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await axios.post(
        'https://api.houzie.in/auth/login/verify',
        {
          userId: userId,
          otp: otp,
        }
      );
      const userData = {
        userid: result.data.user.id,
        email: result.data.user.email,
        accessToken: result.data.accessToken,
        role: result.data.user.role,
        refreshToken: result.data.refreshToken,
        phoneNumber: result.data.user.phoneNumber,
      };

      login(userData);
      localStorage.removeItem('registrationComplete');

      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setCanResend(false);
    setResendCooldown(60);

    const intervalId = setInterval(() => {
      setResendCooldown((prevCooldown) => {
        if (prevCooldown <= 1) {
          clearInterval(intervalId);
          setCanResend(true);
          return 0;
        } else {
          return prevCooldown - 1;
        }
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (!phoneNumber.startsWith('+91') || phoneNumber.length < 12) {
      setFieldErrors(
        'Please enter a valid phone number starting with +91 and at least 12 characters.'
      );
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`https://api.houzie.in/auth/login/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast.success({
        title: 'OTP Resent',
        description: 'A new OTP has been sent to your phone number.',
      });

      startResendCooldown();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push(`/${redirectUrl}`);
  };

  return (
    <div className='flex justify-center items-center h-full min-h-screen bg-[#5b86e5] p-4'>
      <Card className='w-full max-w-4xl shadow-lg rounded-3xl overflow-hidden bg-[#abc1f2] border-none'>
        <div className='flex h-full flex-col md:flex-row'>
          {/* Left Side (Blue Background) */}
          <div className='hidden md:flex w-full md:w-1/2  flex-col justify-center items-start p-4 relative'>
            <div className='text-2xl md:text-3xl font-normal font-poppins text-white text-start'>
              Need a place without any hassle?
            </div>
            <Image
              src='/svg/signup logo.svg'
              alt='Houzie Logo'
              width={400}
              height={400}
              className='relative -top-5 -left-1'
            />
            <div className='text-2xl md:text-3xl font-normal font-poppins text-white text-center relative -top-5'>
              will help you.
            </div>
          </div>
          <div className='w-full md:w-1/2 p-8 h-full rounded-3xl bg-white flex flex-col justify-start items-start'>
            <div className='h-full w-full py-28'>
              <CardHeader className='space-y-1 flex flex-col items-center p-2'>
                <CardTitle className='text-5xl md:text-6xl text-center mb-4'>
                  Verify
                </CardTitle>
              </CardHeader>
              <CardContent className='w-[90%] md:w-[80%] mx-auto p-0'>
                <div className='grid gap-4'>
                  <CardDescription className=' mb-2 w-full'>
                    <CustomInput
                      type='text'
                      name='phoneNumber'
                      label='Phone Number'
                      onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                      value={phoneNumber || ''}
                      onChange={handleInputChange}
                      error={
                        fieldErrors['phoneNumber']
                          ? 'This field is required'
                          : ''
                      }
                      className={cn(
                        'placeholder:text-[#646464] col-span-1 text-[#646464] block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow',
                        {
                          'ring-2 ring-red-500 ring-offset-1':
                            fieldErrors['phoneNumber'],
                        }
                      )}
                      placeholder='Enter Phone Number'
                    />
                    {step === 1 && (
                      <div className='w-full flex justify-center items-center'>
                        <Button
                          size='custom'
                          className='  bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg my-2'
                          onClick={handleContinue}
                        >
                          {loading ? (
                            'Loading...'
                          ) : (
                            <div className='flex gap-1 justify-center items-center'>
                              <p>Continue</p> <ChevronRight className='' />
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardDescription>
                  {step === 2 && (
                    <Button onClick={handleInitiateLogin}>
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  )}
                  {step === 3 && (
                    <>
                      <div className='flex gap-2 flex-col justify-center items-start text-center'>
                        <Label htmlFor='otp' className='text-black mb-2'>
                          OTP
                        </Label>
                        <InputOTP maxLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        <div className='flex justify-end items-end w-full'>
                          <Button
                            variant='ghost'
                            size='custom'
                            className='text-[#3b8ff6] p-0 '
                            onClick={handleResendOTP}
                            disabled={!canResend}
                          >
                            {canResend
                              ? 'Resend OTP'
                              : `Resend OTP in ${resendCooldown}s`}
                          </Button>
                        </div>
                      </div>
                      <Button onClick={handleVerifyOTP} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerifyNumber;
