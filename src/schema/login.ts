import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  loginTypeEmail: z.boolean().default(false),
  phoneNumber: z
    .string()
    .max(10, { message: 'phone number should not exceed 10' }),
  otp: z.string().min(6, { message: 'OTP must be 6 digits long' }),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
