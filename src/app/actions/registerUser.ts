'use server';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z
    .string()
    .regex(
      /^\+91\d{10}$/,
      'Invalid phone number format (should be +91 followed by 10 digits)'
    ),
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, 'Invalid Aadhar number (should be 12 digits)'),
  role: z.enum(['ADMIN', 'USER'], { required_error: 'Role is required' }),
});

export async function registerUser(formData: FormData) {
  try {
    // const validatedFields = RegisterSchema.safeParse({
    //   name: formData.get('name'),
    //   email: formData.get('email'),
    //   phoneNumber: formData.get('phoneNumber'),
    //   aadharNumber: formData.get('aadharNumber'),
    //   role: formData.get('role'),
    // });
    // console.log('🚀 ~ registerUser ~ validatedFields:', validatedFields);
    // if (!validatedFields.success) {
    //   return {
    //     status: 'error',
    //     errors: validatedFields.error.flatten().fieldErrors,
    //   };
    // }
    // Here you would typically make your API call or database operation
    // For demonstration, we'll simulate a delay
    // return {
    //   status: 'success',
    //   message: 'Registration successful! You can now login.',
    // };
  } catch (error) {
    // return {
    //   status: 'error',
    //   message: 'An unexpected error occurred during registration.',
    // };
  }
}
