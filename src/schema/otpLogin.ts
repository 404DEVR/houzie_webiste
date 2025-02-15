import * as z from 'zod';

// Define the schema for OTP login
export const OTPLoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .nonempty({ message: 'Email is required' }),
  otp: z
    .string()
    .regex(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
    .optional(), // OTP is optional during the initial request
});

// Define the TypeScript type inferred from the schema
export type OTPLoginFormData = z.infer<typeof OTPLoginSchema>;
