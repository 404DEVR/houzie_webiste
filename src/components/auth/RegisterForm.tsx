'use client';

import { useFormStatus } from 'react-dom';

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

import { registerUser } from '@/app/actions/registerUser';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className='w-full' type='submit' disabled={pending}>
      {pending ? 'Registering...' : 'Register'}
    </Button>
  );
}

export default function RegisterForm() {
  return (
    <Card className='w-full max-w-lg mx-auto'>
      <CardHeader>
        <CardTitle>Registration</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <form action={registerUser}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Full Name</Label>
            <Input id='name' name='name' placeholder='John Doe' />
            {/* {state.errors?.name && (
              <p className='text-sm text-red-500'>{state.errors.name[0]}</p>
            )} */}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='john.doe@example.com'
            />
            {/* {state.errors?.email && (
              <p className='text-sm text-red-500'>{state.errors.email[0]}</p>
            )} */}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              name='phoneNumber'
              placeholder='+919876543210'
            />
            {/* {state.errors?.phoneNumber && (
              <p className='text-sm text-red-500'>
                {state.errors.phoneNumber[0]}
              </p>
            )} */}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='aadharNumber'>Aadhar Number</Label>
            <Input
              id='aadharNumber'
              name='aadharNumber'
              placeholder='123456781234'
            />
            {/* {state.errors?.aadharNumber && (
              <p className='text-sm text-red-500'>
                {state.errors.aadharNumber[0]}
              </p>
            )} */}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <Select name='role'>
              <SelectTrigger>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='USER'>User</SelectItem>
              </SelectContent>
            </Select>
            {/* {state.errors?.role && (
              <p className='text-sm text-red-500'>{state.errors.role[0]}</p>
            )} */}
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          {/* {state.status === 'success' && (
            <Alert className='bg-green-50'>
              <AlertDescription className='text-green-600'>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
          {state.status === 'error' && state.message && (
            <Alert className='bg-red-50'>
              <AlertDescription className='text-red-600'>
                {state.message}
              </AlertDescription>
            </Alert>
          )} */}
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
