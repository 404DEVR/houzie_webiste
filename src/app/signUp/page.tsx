'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Apple, Eye, Lock, Mail, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebook } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import * as z from 'zod';

import { toast } from '@/hooks/use-toast';

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

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  role: z.string().default('RENTER'),
});

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://api.houzie.in/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'BROKER',
      });

      toast({
        title: 'Registration Successful',
        description: 'You have successfully signed up. Redirecting...',
      });

      // Redirect to login or home page
      router.push('/');
    } catch (error: any) {
      // Show error toast
      toast({
        title: 'Registration Failed',
        description:
          error.response?.data?.message ||
          'An error occurred during registration. Please try again.',
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
          <CardTitle className='text-3xl text-center'>Sign Up</CardTitle>
          <CardDescription className='text-center'>
            Already Have An Account?{' '}
            <a href='/login' className='text-[#42A4AE]'>
              Sign In Here
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 w-[90%] mx-auto'>
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
            {/* <div className='grid gap-2'>
              <Label htmlFor='lookingFor'>I am looking for</Label>
              <Select {...register('lookingFor')}>
                <SelectTrigger id='lookingFor'>
                  <SelectValue placeholder='Property' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='property'>Property</SelectItem>
                  <SelectItem value='postMyProperty'>
                    Post my property
                  </SelectItem>
                  <SelectItem value='propertyAgent'>Property agent</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            {/* <div className='flex items-center space-x-2'>
              <Checkbox id='keepSignedIn' {...register('keepSignedIn')} />
              <Label htmlFor='keepSignedIn'>Keep me signed in</Label>
            </div> */}
          </form>
        </CardContent>
        <CardFooter className='flex flex-col w-[90%] mx-auto items-center'>
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
              className=' rounded-md p-2 flex items-center'
            >
              <Apple className='h-5 w-5 mr-2' /> Apple
            </Button>
            <Button
              variant='outline'
              className=' rounded-md p-2 flex items-center'
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
