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

  const {
    register,
    handleSubmit,
    control,
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post('https://api.houzie.in/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        role: data.role,
      });
      toast({
        title: 'Registration Successful',
        description: 'You have successfully signed up. Redirecting...',
      });
      router.push('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        if (responseData.status === 'fail' && responseData.message) {
          toast({
            title: 'Registration Failed',
            description: responseData.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Registration Failed',
            description: 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Registration Failed',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
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
            <a href='/login?signUpRedirect=signUp' className='text-[#42A4AE]'>
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

export default withAuthRedirect(SignUpForm);
