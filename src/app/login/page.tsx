'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Apple, ChevronRight, Eye, Lock, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebook } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import * as z from 'zod';

import { toast } from '@/hooks/use-toast';
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
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

const LOGIN_URL = 'https://api.houzie.in/auth/login/email/pw';

const SignUpForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const signUpRedirect = searchParams.get('signUpRedirect');
  const redirectPath = searchParams.get('redirect') || '/';
  const [showOTPForm, setShowOTPForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState<string>('+91');
  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const userData = {
        userid: response.data.user.id,
        email: response.data.user.email,
        accessToken: response.data.accessToken,
        role: response.data.user.role,
        refreshToken: response.data.refreshToken,
      };

      login(userData);
      router.push(redirectPath);

      // console.log(redirectPath);
      toast({
        title: 'Login Successful',
        description: 'Successfully signed in',
      });
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
      console.log(error);
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

      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const response = await axios.post('https://api.houzie.in/auth/google');
      if (response.status === 200) {
        const { redirectUrl, message } = response.data;
        toast({
          title: 'Google Sign Up Successful',
          description: message || 'Successfully signed up with Google.',
        });
        if (redirectUrl && typeof redirectUrl === 'string') {
          router.push(redirectUrl);
        } else {
          router.push('/broker');
        }
      }
    } catch (error) {
      toast({
        title: 'Google Sign Up Failed',
        description:
          'An error occurred during Google sign up. Please try again.',
        variant: 'destructive',
      });
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

      toast({
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
            <div className='w-full md:w-1/2 p-8 h-full rounded-3xl bg-white flex flex-col justify-center items-center'>
              {!showOTPForm ? (
                <div className='h-auto w-full pt-20'>
                  <CardHeader className='space-y-1 flex flex-col items-center p-2'>
                    <CardTitle className='text-3xl md:text-4xl text-center mb-8'>
                      Log In
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='w-[90%] md:w-[80%] mx-auto p-0'>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className='grid gap-4'
                    >
                      <div className='grid gap-2'>
                        <Label htmlFor='email'>Email Address</Label>
                        <div className='relative'>
                          <Mail className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                          <Input
                            id='email'
                            placeholder='hello@example.com'
                            type='email'
                            className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
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
                            className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                            {...register('password')}
                          />
                          <Button
                            variant='ghost'
                            size='icon'
                            type='button'
                            className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8'
                            onClick={() => setShowPassword(!showPassword)}
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
                    </form>
                  </CardContent>
                </div>
              ) : (
                <div className='h-full w-full py-28'>
                  <CardHeader className='space-y-1 flex flex-col items-center p-2'>
                    <CardTitle className='text-5xl md:text-6xl text-center mb-4'>
                      Login
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='w-[90%] md:w-[80%] mx-auto p-0'>
                    <div className='grid gap-4'>
                      <CardDescription className=' mb-2'>
                        <div className='grid gap-2'>
                          <Label htmlFor='phoneNumber' className='text-black'>
                            Mobile Number
                          </Label>
                          <div className='relative'>
                            <Phone className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                            <Input
                              id='phoneNumber'
                              placeholder='Phone Number'
                              type='tel'
                              value={phoneNumber}
                              className='pl-8 placeholder:text-slate-700 text-slate-700 placeholder:text-sm sm:text-sm rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                              onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                setPhoneNumberError('');
                              }}
                            />
                          </div>
                          {phoneNumberError && (
                            <p className='text-red-500 text-[10px] leading-tight'>
                              {phoneNumberError}
                            </p>
                          )}
                        </div>
                      </CardDescription>
                      {step === 1 && (
                        <Button onClick={handleInitiateLogin}>
                          {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                      )}
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
                          <Button
                            size='custom'
                            className=' bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-2'
                            onClick={handleVerifyOTP}
                            disabled={loading}
                          >
                            {loading ? (
                              'Logging In...'
                            ) : (
                              <div className='flex gap-1 justify-center items-center'>
                                <p>Log In</p> <ChevronRight className='' />
                              </div>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </div>
              )}
              <CardFooter className='flex flex-col w-[90%] mx-auto items-center py-4 '>
                {!showOTPForm && (
                  <>
                    <Button
                      size='custom'
                      className=' bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-4'
                      onClick={handleSubmit(onSubmit)}
                      disabled={loading}
                    >
                      {loading ? (
                        'Signing Up...'
                      ) : (
                        <div className='flex gap-1 justify-center items-center'>
                          <p>Log In</p> <ChevronRight className='' />
                        </div>
                      )}
                    </Button>
                    <div className='text-center text-xs flex gap-1'>
                      <Button
                        size='custom'
                        onClick={() => setShowOTPForm(true)}
                        className='text-[#3b82f6]'
                      >
                        Login via Phone Number
                      </Button>
                    </div>
                  </>
                )}
                {!showOTPForm && (
                  <div className='pb-20'>
                    <div className='flex items-center justify-center w-[60%] mx-auto mt-4'>
                      <div className='border-t border-gray-400 flex-grow '></div>
                      <span className='mx-4 text-black'>Or</span>
                      <div className='border-t border-gray-400 flex-grow '></div>
                    </div>
                    <div className='flex  justify-center gap-4 w-full pt-4 flex-row'>
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
                  </div>
                )}
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
      {/* <div className='flex justify-center items-center h-screen bg-gray-100'>
        <Card className='w-full max-w-md shadow-md bg-[#ffffff]'>
          <CardHeader className='space-y-1 flex flex-col items-center'>
            <Image
              src='/svg/houzie-logo.svg'
              alt='Houzie Logo'
              width={120}
              height={120}
              className='mb-2'
            />
            <CardTitle className='text-3xl text-center'>Sign In</CardTitle>
            <CardDescription className='text-center'>
              Need to create an account?{' '}
              <a href={`/${signUpRedirect}`} className='text-[#42A4AE]'>
                Sign up here
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 w-[90%] mx-auto'>
            {!showOTPForm ? (
              <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <div className='relative'>
                    <Mail className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                    <Input
                      id='email'
                      placeholder='hello@example.com'
                      type='email'
                      className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
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
                      className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      {...register('password')}
                    />
                    <Button
                      variant='ghost'
                      size='icon'
                      type='button'
                      className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8'
                      onClick={() => setShowPassword(!showPassword)}
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
              </form>
            ) : (
              <>
                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email Address</Label>
                    <div className='relative'>
                      <Mail className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                      <Input
                        id='email'
                        placeholder='hello@example.com'
                        type='email'
                        className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p className='text-red-500 text-sm'>
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  {step === 1 && (
                    <Button onClick={handleInitiateLogin} disabled={loading}>
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  )}
                  {step === 2 && (
                    <>
                      <div className='flex gap-2 flex-col justify-center items-center text-center'>
                        <Label htmlFor='otp' className='text-2xl mb-2'>
                          Enter OTP
                        </Label>
                        <InputOTP maxLength={6}>
                          <InputOTPGroup>
                            {[0, 1, 2].map((index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            {[3, 4, 5].map((index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <Button onClick={handleVerifyOTP} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className='flex flex-col w-[90%] mx-auto items-center'>
            {!showOTPForm && (
              <>
                <Button
                  className='w-full bg-[#42A4AE] text-white hover:bg-teal-700 py-4 rounded-xl'
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className='flex items-center justify-center w-full my-4'>
                  <div className='border-t border-gray-400 flex-grow'></div>
                  <span className='mx-4 text-black'>Or</span>
                  <div className='border-t border-gray-400 flex-grow'></div>
                </div>

                <Button
                  onClick={() => setShowOTPForm(true)}
                  className='w-full bg-[#42A4AE] text-white hover:bg-teal-700 py-4 rounded-xl'
                >
                  Login Using OTP
                </Button>

                <div className='flex items-center justify-center w-full mt-4'>
                  <div className='border-t border-gray-400 flex-grow'></div>
                  <span className='mx-4 text-black'>Or</span>
                  <div className='border-t border-gray-400 flex-grow'></div>
                </div>

                <div className='flex flex-wrap justify-center gap-4 w-full my-4'>
                  <Button
                    onClick={handleGoogleSignUp}
                    variant='outline'
                    className='rounded-md p-2 flex items-center'
                  >
                    <FcGoogle className='h-5 w-5 mr-2' /> Google
                  </Button>
                  <Button
                    variant='outline'
                    className='rounded-md p-2 flex items-center'
                  >
                    <Apple className='h-5 w-5 mr-2' /> Apple
                  </Button>
                  <Button
                    variant='outline'
                    className='rounded-md p-2 flex items-center'
                  >
                    <FaFacebook className='h-5 w-5 mr-2' /> Facebook
                  </Button>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </div> */}
    </>
  );
};

const LoginPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
};

export default withAuthRedirect(LoginPage);
