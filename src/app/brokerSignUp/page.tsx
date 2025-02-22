'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Apple,
  Building2,
  CreditCard,
  Eye,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaFacebook } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import axios from 'axios';

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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

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
  companyName: z.string().optional(),
  adharNumber: z
    .string()
    .regex(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, {
      message: 'Please enter a valid Adhar number',
    })
    .optional(),
  role: z.string().default('BROKER'),
});

type FormData = z.infer<typeof formSchema>;

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '+91',
      companyName: '',
      adharNumber: '',
      role: 'REAL_ESTATE_AGENT',
    },
  });

  useEffect(() => {
    if (!getValues('phoneNumber')) {
      setValue('phoneNumber', '+91');
    }
  }, [setValue, getValues]);

  const onSubmit = async (data: FormData) => {
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

      toast({
        title: 'Registration Successful',
        description: 'Please verify your phone number.',
      });
    } catch (error) {
      console.log(error);
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

      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-3xl shadow-md'>
        {' '}
        {/* Increased max-w */}
        <CardHeader className='space-y-1 flex flex-col items-center'>
          <Image
            src='/svg/logo light.svg'
            alt='Houzie Logo'
            width={120}
            height={120}
            className='mb-2'
          />
          <CardTitle className='text-3xl text-center'>
            {showOTPForm ? 'Verify Phone Number' : 'Sign Up'}
          </CardTitle>
          {!showOTPForm && (
            <CardDescription className='text-center'>
              Already Have An Account?{' '}
              <a href='/login' className='text-[#42A4AE]'>
                Sign In Here
              </a>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className='w-[90%] mx-auto'>
          {!showOTPForm ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='grid gap-4 md:grid-cols-2'
            >
              {' '}
              {/* Using grid and md:grid-cols-2 */}
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <div className='relative'>
                  <User className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    id='name'
                    placeholder='John Doe'
                    type='text'
                    className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
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
              <div className='grid gap-2'>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <div className='relative'>
                  <Phone className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    id='phoneNumber'
                    placeholder='Phone Number'
                    type='tel'
                    className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                    {...register('phoneNumber')}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className='text-red-500 text-sm'>
                    {errors.phoneNumber?.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='companyName'>Company Name</Label>
                <div className='relative'>
                  <Building2 className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    id='companyName'
                    placeholder='Company Name'
                    type='text'
                    className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                    {...register('companyName')}
                  />
                </div>
                {errors.companyName && (
                  <p className='text-red-500 text-sm'>
                    {errors.companyName?.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='adharNumber'>Adhar Number</Label>
                <div className='relative'>
                  <CreditCard className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    id='adharNumber'
                    placeholder='Adhar Number'
                    type='tel'
                    className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                    {...register('adharNumber')}
                  />
                </div>
                {errors.adharNumber && (
                  <p className='text-red-500 text-sm'>
                    {errors.adharNumber?.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2 md:col-span-2'>
                <Label htmlFor='role'>Registering as :</Label>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        id='role'
                        className='focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      >
                        <SelectValue
                          placeholder='Select Role'
                          className='text-gray-500'
                        />
                      </SelectTrigger>
                      <SelectContent className='focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'>
                        <SelectItem value='PROPERTY_OWNER'>Owner</SelectItem>
                        <SelectItem value='REAL_ESTATE_AGENT'>
                          Real estate agent
                        </SelectItem>
                        <SelectItem value='FLAT_MATES'>
                          Current occupant, looking for flatmates
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
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
                  <div className='grid gap-2'>
                    <Label htmlFor='otp'>OTP</Label>
                    <Input
                      id='otp'
                      placeholder='Enter OTP'
                      type='text'
                      className='pl-8 placeholder:text-slate-700 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
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
            <Button
              size='custom'
              className='w-full bg-[#42A4AE] text-white hover:bg-teal-700 py-4 rounded-xl'
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          )}
          {!showOTPForm && (
            <>
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
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default withAuthRedirect(SignUpForm);
