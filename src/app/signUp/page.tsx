'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  Apple,
  ChevronRight,
  Eye,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'; // Import useEffect
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import * as z from 'zod';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import withAuthRedirect from '@/components/hoc/withAuthRedirect';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  phoneNumber: z
    .string()
    .refine(
      (value) =>
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value) &&
        value.startsWith('+91'),
      {
        message: 'Please enter a valid phone number starting with +91',
      }
    ),
  role: z.string().default('BROKER'),
});

const SignUpForm = () => {
  const toast = useCustomToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [showOTPForm, setShowOTPForm] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '+91',
      role: 'RENTER',
    },
  });

  useEffect(() => {
    if (!getValues('phoneNumber')) {
      setValue('phoneNumber', '+91');
    }
  }, [setValue, getValues]);

  // useEffect(() => {
  //   const registrationComplete = localStorage.getItem('registrationComplete');
  //   if (registrationComplete === 'true' && showOTPForm) {
  //     router.push('/');
  //   }
  // }, [showOTPForm, router]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`https://api.houzie.in/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      setPhoneNumber(data.phoneNumber);
      setEmail(data.email);
      setShowOTPForm(true);
      localStorage.setItem('registrationComplete', 'true');

      toast.success({
        title: 'Registration Successful',
        description: 'Please verify your phone number.',
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      toast.error({
        title: 'Registration Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(data.message || 'Failed to send OTP');
      }

      setUserId(data.userId);
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
      setPhoneNumberError(
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
      console.log(error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            {/* Right Side (Sign Up Form) */}
            <div className='w-full md:w-1/2 py-20 px-8 h-full rounded-3xl bg-white flex flex-col justify-center items-center'>
              {!showOTPForm ? (
                <div className='h-auto w-full'>
                  <CardHeader className='space-y-1 flex flex-col items-center p-2'>
                    <CardTitle className='text-3xl md:text-4xl text-center'>
                      Sign Up
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='w-[90%] md:w-[80%] mx-auto p-0'>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className='grid gap-4'
                    >
                      <div className='grid gap-2'>
                        <Label htmlFor='name'>Name</Label>
                        <div className='relative'>
                          <User className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                          <Input
                            id='name'
                            placeholder='John Doe'
                            type='text'
                            className='pl-8  placeholder:text-slate-700 text-slate-700 placeholder:text-sm sm:text-xs rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                            {...register('name')}
                          />
                        </div>
                        {errors.name && (
                          <p className='text-red-500 text-sm'>
                            {errors.name?.message}
                          </p>
                        )}
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='email'>Email Address</Label>
                        <div className='relative'>
                          <Mail className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                          <Input
                            id='email'
                            placeholder='hello@example.com'
                            type='email'
                            className='pl-8  placeholder:text-slate-700 text-slate-700 placeholder:text-sm sm:text-xs rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                            {...register('email')}
                          />
                        </div>
                        {errors.email && (
                          <p className='text-red-500 text-sm'>
                            {errors.email?.message}
                          </p>
                        )}
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <div className='relative'>
                          <Lock className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                          <Input
                            id='password'
                            placeholder='Password'
                            type={showPassword ? 'text' : 'password'}
                            className='pl-8  placeholder:text-slate-700 text-slate-700 placeholder:text-sm sm:text-xs rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                            {...register('password')}
                          />
                          <Button
                            variant='ghost'
                            size='icon'
                            className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8'
                            onClick={() => setShowPassword(!showPassword)}
                            type='button'
                          >
                            <Eye className='h-4 w-4' />
                            <span className='sr-only'>Show password</span>
                          </Button>
                        </div>
                        {errors.password && (
                          <p className='text-red-500 text-sm'>
                            {errors.password?.message}
                          </p>
                        )}
                      </div>
                      {/* New Phone Number Field */}
                      <div className='grid gap-2'>
                        <Label htmlFor='phoneNumber'>Phone Number</Label>
                        <div className='relative'>
                          <Phone className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                          <Input
                            id='phoneNumber'
                            placeholder='Phone Number'
                            type='tel'
                            className='pl-8  placeholder:text-slate-700 text-slate-700 placeholder:text-sm sm:text-xs rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                            {...register('phoneNumber')}
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className='text-red-500 text-sm'>
                            {errors.phoneNumber?.message}
                          </p>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </div>
              ) : (
                <div className='h-full w-full py-28'>
                  <CardHeader className='space-y-1 flex flex-col items-center p-2'>
                    <CardTitle className='text-5xl md:text-6xl text-center mb-4'>
                      Verify
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='w-[90%] md:w-[80%] mx-auto p-0'>
                    <h2 className='text-xs mb-4 text-gray-400 font-normal'>Please Confirm Your Phone Number and verify it!</h2>
                    <div className='grid gap-4'>
                      <CardDescription className=' mb-2'>
                         <div className='grid gap-2'>
                          <Label htmlFor='phoneNumber' className='text-black'>
                            Mobile Number
                          </Label>
                          <div className='relative flex justify-between items-center gap-2 '>
                            <Phone className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />

                            {step === 2 && (
                              <Button
                                variant='ghost'
                                size='custom'
                                className=' p-0 cursor-pointer absolute top-2.5 right-2.5 text-[#3b8ff6] '
                                onClick={handleResendOTP}
                                disabled={!canResend}
                              >
                                {canResend
                                  ? 'Resend OTP'
                                  : `Resend OTP in ${resendCooldown}s`}
                              </Button>
                            )}

                            <Input
                              id='phoneNumber'
                              placeholder='Phone Number'
                              type='tel'
                              value={phoneNumber}
                              readOnly
                              className='pl-8 placeholder:text-slate-700 text-slate-700 placeholder:text-sm sm:text-sm rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                              onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                setPhoneNumberError('');
                              }}
                            />
                            {step === 1 && (
                              <div
                                className='cursor-pointer relative text-[#3b8ff6] text-nowrap'
                                onClick={handleInitiateLogin}
                              >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                              </div>
                            )}
                          </div>
                          {phoneNumberError && (
                            <p className='text-red-500 text-[10px] leading-tight'>
                              {phoneNumberError}
                            </p>
                          )}
                        </div>
                      </CardDescription>
                      {/* {step === 1 && (
                        <Button onClick={handleInitiateLogin}>
                          {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                      )} */}
                      {step === 2 && (
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
              )}
              <CardFooter className='flex flex-col w-[90%] mx-auto items-center py-2 '>
                {!showOTPForm && (
                  <>
                    <Button
                      size='custom'
                      className=' bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-2'
                      onClick={handleSubmit(onSubmit)}
                      disabled={loading}
                    >
                      {loading ? (
                        'Signing Up...'
                      ) : (
                        <div className='flex gap-1 justify-center items-center'>
                          <p>Sign Up</p> <ChevronRight className='' />
                        </div>
                      )}
                    </Button>
                    <p className='text-center text-xs flex gap-1'>
                      Already Have An Account?
                      <a
                        href='/login?signUpRedirect=brokerSignUp&redirect='
                        className='text-[#3b82f6]'
                      >
                        Sign In Here
                      </a>
                    </p>
                  </>
                )}
                {!showOTPForm && (
                  <>
                    <div className='flex items-center justify-center w-[60%] mx-auto mt-2'>
                      <div className='border-t border-gray-400 flex-grow '></div>
                      <span className='mx-4 text-black'>Or</span>
                      <div className='border-t border-gray-400 flex-grow '></div>
                    </div>
                    <div className='flex  justify-center gap-4 w-full pt-2 flex-row'>
                      <Button
                        variant='outline'
                        className='rounded-md w-1/2 md:w-full flex items-center justify-center'
                      >
                        <FcGoogle className='h-5 w-5 mr-2' /> Google
                      </Button>
                      <Button
                        variant='outline'
                        className=' rounded-md  w-1/2 md:w-full flex items-center justify-center'
                      >
                        <Apple className='h-5 w-5 mr-2' /> Apple
                      </Button>
                    </div>
                  </>
                )}
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default withAuthRedirect(SignUpForm);
