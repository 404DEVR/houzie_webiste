'use server';

import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^\+91[1-9]\d{9}$/, 'Invalid Indian phone number'),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar number must be 12 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'USER']),
});

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phoneNumber: formData.get('phoneNumber'),
    aadharNumber: formData.get('aadharNumber'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  // Here you would typically save the user to your database
  // For this example, we'll just return a success message
  return { success: 'User registered successfully!' };
}
