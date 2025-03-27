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
import { FcGoogle } from 'react-icons/fc';
import * as z from 'zod';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import ForgotPasswordFlow from '@/components/auth/ForgetPassword';
import withAuthRedirect from '@/components/hoc/withAuthRedirect';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

const LOGIN_URL = 'https://api.houzie.in/auth/login/email/pw';

const SignUpForm = () => {
  const toast = useCustomToast();
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const signUpRedirect = searchParams.get('signUpRedirect');
  const redirectPath = searchParams.get('redirect') || '/';
  const [showForm, setShowForm] = useState<string>('email');
  const [email, setEmail] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [fieldErrors, setFieldErrors] = useState({});
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
      router.push(`/${redirectPath}`);
      // console.log(redirectPath);

      // console.log(redirectPath);
      toast.success({
        title: `Welcome ${response.data.user.email}`,
        description: 'You have successfully logged In',
        duration: 5000,
      });
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error({
        title: 'Login Failed',
        description: 'There was a problem Please Try again Later',
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

      toast.success({
        title: `Welcome ${result.data.user.email}`,
        description: 'You have successfully logged In',
        duration: 5000,
      });
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
        toast.success({
          title: 'Google Sign Up Successful',
          description: 'Successfully signed up with Google.',
        });
        if (redirectUrl && typeof redirectUrl === 'string') {
          router.push(redirectUrl);
        } else {
          router.push('/broker');
        }
      }
    } catch (error) {
      toast.error({
        title: 'Google Sign Up Failed',
        description:
          'An error occurred during Google sign up. Please try again.',
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

      toast.success({
        title: 'OTP Resent!',
        description: 'A new OTP has been sent to your phone number',
      });

      startResendCooldown();
    } catch (error) {
      console.log(error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRequiredFields = () => {
    const commonFields = [
      'location',
      'propertyType',
      'configuration',
      'furnishing',
      'availableFrom',
      'preferredTenant',
      'features',
    ];
    return commonFields;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setResetEmail(value);

    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleForgotLink = async () => {
    if (!resetEmail.trim()) {
      setFieldErrors({ email: 'Please enter an email' });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.houzie.in/auth/forgot-password',
        { email: resetEmail }
      );
      toast.success({
        title: 'Link Sent!',
        description: 'Reset link sent successfully to your phone number',
      });
    } catch (error) {
      console.error('Error:', error);
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
            <div className='w-full md:w-1/2 p-8 h-full rounded-3xl flex flex-col bg-white justify-center items-center'>
              {showForm === 'email' ? (
                <div className='h-auto w-full pt-20 '>
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
                            className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
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
                            className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
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
                    <div className='flex justify-end items-center mt-2'>
                      <Button
                        onClick={() => setShowForm('forgotPassword')}
                        size='custom'
                        className='text-[#3b8ff6]'
                      >
                        Forgot Password
                      </Button>
                    </div>
                    <div className='flex flex-col gap-2 mt-4 justify-center items-center'>
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
                            <p>Log In</p> <ChevronRight className='' />
                          </div>
                        )}
                      </Button>
                      <div className='text-center text-xs flex gap-1'>
                        <Button
                          size='custom'
                          onClick={() => setShowForm('phone')}
                          className='text-[#3b82f6]'
                        >
                          Login via Phone Number
                        </Button>
                      </div>
                      <p className='text-center text-xs flex gap-1 mt-2'>
                        Don't Have An Account?
                        <a
                          href={
                            signUpRedirect === 'signUpRedirect'
                              ? '/brokerSignUp'
                              : '/signUp'
                          }
                          className='text-[#3b82f6]'
                        >
                          Sign Up Here
                        </a>
                      </p>
                    </div>
                    <div className='pb-10'>
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
                  </CardContent>
                </div>
              ) : showForm === 'phone' ? (
                <div
                  className={`h-full w-full  ${step === 1 ? 'py-20' : 'pt-20'}`}
                >
                  <CardHeader className='space-y-1 flex flex-col items-center p-2'>
                    <CardTitle className='text-3xl md:text-4xl text-center mb-8'>
                      Log In
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
                            {step === 1 && (
                              <div
                                className='cursor-pointer absolute top-2.5 right-2.5 text-[#3b8ff6]'
                                onClick={handleInitiateLogin}
                              >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                              </div>
                            )}
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
                          </div>
                        </>
                      )}
                      <Button
                        size='custom'
                        className='bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-2'
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

                      <div className='flex flex-col gap-2 justify-center items-center'>
                        <div className='text-center text-xs flex gap-1'>
                          <Button
                            size='custom'
                            onClick={() => setShowForm('email')}
                            className='text-[#3b82f6]'
                          >
                            Login via Email
                          </Button>
                        </div>
                        <p className='text-center text-xs flex gap-1'>
                          Don't Have An Account?
                          <a
                            href={
                              signUpRedirect === 'signUpRedirect'
                                ? '/brokerSignUp'
                                : '/signUp'
                            }
                            className='text-[#3b82f6]'
                          >
                            Sign Up Here
                          </a>
                        </p>
                      </div>

                      <div className=''>
                        <div className='flex items-center justify-center w-[60%] mx-auto mt-0'>
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
                    </div>
                  </CardContent>
                </div>
              ) : (
                <ForgotPasswordFlow />
                // <div className='h-auto w-full py-40'>
                //   <CardHeader className='space-y-1 flex flex-col items-center p-2'>
                //     <CardTitle className='text-3xl md:text-4xl text-center mb-8'>
                //       Forgot Password
                //     </CardTitle>
                //   </CardHeader>
                //   <CardContent className='w-[90%] md:w-[80%] mx-auto p-0'>
                //     <form className='grid gap-4'>
                //       <div className='grid gap-2'>
                //         <Label htmlFor='email'>Email Address</Label>
                //         <div className='relative'>
                //           <Mail className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                //           <Input
                //             id='email'
                //             placeholder='hello@example.com'
                //             type='email'
                //             className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#3b8ff6] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                //             onChange={(e) => setResetEmail(e.target.value)}
                //           />
                //         </div>
                //         {fieldErrors['email'] && (
                //           <p className='text-red-500 text-sm'>
                //             Please Enter An Email
                //           </p>
                //         )}
                //       </div>
                //     </form>

                //     <div className='flex flex-col gap-2 justify-center items-center mt-6'>
                //       <Button
                //         onClick={handleForgotLink}
                //         size='custom'
                //         className=' bg-[#3b82f6] text-white hover:bg-[#6190dc] py-2 px-6 rounded-lg mb-4'
                //         disabled={loading}
                //       >
                //         {loading ? (
                //           'Sending...'
                //         ) : (
                //           <div className='flex gap-1 justify-center items-center'>
                //             <p>Send Password Reset Link</p>
                //             <ChevronRight className='' />
                //           </div>
                //         )}
                //       </Button>
                //       <div className='flex flex-col gap-2 justify-center items-center'>
                //         <div className='text-center text-xs flex gap-1'>
                //           <Button
                //             size='custom'
                //             onClick={() => setShowForm('email')}
                //             className='text-[#3b82f6]'
                //           >
                //             Back to Login
                //           </Button>
                //         </div>
                //       </div>
                //     </div>
                //   </CardContent>
                // </div>
              )}
            </div>
          </div>
        </Card>
      </div>
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
