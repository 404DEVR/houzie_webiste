import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerificationSuccess: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  onVerificationSuccess,
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(parseInt(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpString = otp.join('');
      const response = await axios.post(
        'https://api.houzie.in/auth/verify-otp',
        {
          phoneNumber,
          otp: otpString,
        }
      );

      if (response.data.status === 'success') {
        toast({
          title: 'Verification Successful',
          description: 'Your phone number has been verified.',
        });

        onVerificationSuccess();
      } else {
        toast({
          title: 'Verification Failed',
          description: response.data.message || 'Invalid OTP.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: 'Verification Failed',
        description: 'An error occurred during verification.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <CardContent>
        <CardTitle className='text-2xl text-center mb-4'>
          Verify Phone Number
        </CardTitle>
        <CardDescription className='text-center mb-6'>
          Please enter the OTP sent to your phone number {phoneNumber}
        </CardDescription>
        <div className='flex justify-center gap-2 my-4'>
          {otp.map((data, index) => {
            return (
              <Input
                className='w-12 h-12 text-center text-xl'
                type='text'
                name='otp'
                maxLength={1}
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            );
          })}
        </div>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button onClick={handleVerifyOTP}>Verify OTP</Button>
      </CardFooter>
    </>
  );
};

export default OTPVerification;
