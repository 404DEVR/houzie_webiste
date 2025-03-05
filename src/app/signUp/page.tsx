'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Apple, Eye, Lock, Mail, Phone, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'; // Import useEffect
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

      toast({
        title: 'Registration Successful',
        description: 'Please verify your phone number.',
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      toast({
        title: 'Registration Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive',
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

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <Card className='w-full max-w-md shadow-md'>
        <CardHeader className='space-y-1 flex flex-col items-center'>
          <Image
            src='/svg/houzie-logo.svg'
            alt='Houzie Logo'
            width={120}
            height={120}
            className='mb-2'
          />
          <CardTitle className='text-3xl text-center'>Sign Up</CardTitle>
          <CardDescription className='text-center'>
            Already Have An Account?{' '}
            <a href='/login?signUpRedirect=signUp' className='text-[#42A4AE]'>
              Sign In Here
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 w-[90%] mx-auto'>
          {!showOTPForm ? (
            <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <div className='relative'>
                  <User className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    id='name'
                    placeholder='John Doe'
                    type='text'
                    className='pl-8'
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name?.message}</p>
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
                    className='pl-8'
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
                    className='pl-8'
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
                    className='pl-8'
                    {...register('phoneNumber')}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className='text-red-500 text-sm'>
                    {errors.phoneNumber?.message}
                  </p>
                )}
              </div>

              {/* <div className='grid gap-2'>
              <Label htmlFor='role'>I am looking for</Label>
              <Controller
                name='role'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id='role'>
                      <SelectValue placeholder='Select Role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='BROKER'>Broker</SelectItem>
                      <SelectItem value='USER'>User</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div> */}
              {/* <div className='flex items-center space-x-2'>
              <Checkbox id='keepSignedIn' {...register('keepSignedIn')} />
              <Label htmlFor='keepSignedIn'>Keep me signed in</Label>
            </div> */}
            </form>
          ) : (
            <div className='grid gap-4'>
              <CardDescription className='text-center mb-6'>
                Please enter the OTP sent to your phone number {phoneNumber}
              </CardDescription>
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
          )}
        </CardContent>
        <CardFooter className='flex flex-col w-[90%] mx-auto items-center'>
          {!showOTPForm && (
            <>
              <Button
                size='custom'
                className='w-full bg-[#42A4AE] text-white hover:bg-teal-700 py-4 rounded-xl'
                onClick={handleSubmit(onSubmit)}
              >
                Sign Up
              </Button>
              <div className='flex items-center justify-center w-full mt-4'>
                <div className='border-t border-gray-400 flex-grow '></div>
                <span className='mx-4 text-black'>Or</span>
                <div className='border-t border-gray-400 flex-grow '></div>
              </div>
              <div className='flex flex-wrap justify-center gap-4 w-full my-4'>
                <Button
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
    </div>
  );
};

export default withAuthRedirect(SignUpForm);
