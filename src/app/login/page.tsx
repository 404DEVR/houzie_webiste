'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Apple, Eye, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebook } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import * as z from 'zod';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth'; // Ensure this is correctly imported

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
import { Label } from '@/components/ui/label';

import axios from '@/api/axios';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

const LOGIN_URL = '/auth/login/email/pw'; // Updated URL to the API route

const SignUpForm = () => {
  const searchParams = useSearchParams();
  const { login } = useAuth(); // Ensure login is defined in useAuth
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        JSON.stringify({ email: data.email, password: data.password }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const userData = {
        email: response.data.user.email,
        accessToken: response.data.accessToken,
        name: response.data.user.role,
        refreshToken: response.data.refreshToken,
      };

      login(userData);
      console.log(response.data.accessToken);
      router.push('/broker');
      toast({
        title: 'Login Succsfull',
        description: 'Successfully signed In',
      });
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description:
          error.response?.data?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
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
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      toast({
        title: 'Google Sign Up Failed',
        description:
          error.response?.data?.message ||
          'An error occurred during Google sign up. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <Card className='w-full max-w-md shadow-md'>
        <CardHeader className='space-y-1 flex flex-col items-center'>
          <Image
            src='/svg/logo light.svg'
            alt='Houzie Logo'
            width={120}
            height={120}
            className='mb-2'
          />
          <CardTitle className='text-3xl text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Need to create an account?{' '}
            <a href='/login' className='text-[#42A4AE]'>
              Sign up here
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 w-[90%] mx-auto'>
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
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
                <p className='text-red-500 text-sm'>{errors.email?.message}</p>
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
        <CardFooter className='flex flex-col w-[90%] mx-auto items-center'>
          <Button
            size='custom'
            className='w-full bg-[#42A4AE] text-white hover:bg-teal-700 py-4 rounded-xl'
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpForm;
