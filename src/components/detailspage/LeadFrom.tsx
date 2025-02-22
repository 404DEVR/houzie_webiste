'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomInput from '@/components/inputs/CustomInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { LeadformProps } from '@/interfaces/PropsInterface';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phoneNumber: z
    .string()
    .length(10, { message: 'Phone number must be exactly 10 digits' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
  email: z.string().email({ message: 'Invalid email address' }),
  budgetMin: z
    .number()
    .min(1, { message: 'Minimum budget is required' })
    .optional(),
  budgetMax: z
    .number()
    .min(1, { message: 'Maximum budget is required' })
    .optional(),
  preferredLocations: z
    .array(z.string())
    .min(1, { message: 'At least one location is required' }),
  propertyTypes: z
    .array(z.string())
    .min(1, { message: 'At least one property type is required' }),
  note: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const LeadForm = ({ onSubmit, propertyData }: LeadformProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      budgetMin: undefined,
      budgetMax: undefined,
      preferredLocations: [],
      propertyTypes: propertyData ? [propertyData.propertyType] : [],
      note: '',
    },
  });

  const locationOptions = ['Mumbai', 'Navi Mumbai', 'Thane', 'Pune'];
  const propertyTypeOptions = [
    'INDEPENDENT_HOUSE',
    'VILLA',
    'APARTMENT',
    'PLOT',
  ];

  const onSubmitForm = (data: FormData) => {
    onSubmit(data as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <CustomInput
            id='name'
            label='Name'
            placeholder='Enter Name'
            error={errors.name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='phoneNumber'
        control={control}
        render={({ field }) => (
          <CustomInput
            id='phoneNumber'
            label='Phone Number'
            placeholder='Enter Phone Number'
            type='number'
            error={errors.phoneNumber?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='email'
        control={control}
        render={({ field }) => (
          <CustomInput
            id='email'
            label='Email'
            placeholder='Enter Email'
            error={errors.email?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='budgetMin'
        control={control}
        render={({ field }) => (
          <CustomInput
            id='budgetMin'
            label='Minimum Budget'
            placeholder='Enter Min Budget'
            type='number'
            error={errors.budgetMin?.message}
            {...field}
            value={field.value === undefined ? '' : field.value}
            onChange={(e) =>
              field.onChange(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        )}
      />

      <Controller
        name='budgetMax'
        control={control}
        render={({ field }) => (
          <CustomInput
            id='budgetMax'
            label='Maximum Budget'
            placeholder='Enter Max Budget'
            type='number'
            error={errors.budgetMax?.message}
            {...field}
            value={field.value === undefined ? '' : field.value}
            onChange={(e) =>
              field.onChange(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        )}
      />

      <div>
        <Label>Preferred Locations</Label>
        <Controller
          name='preferredLocations'
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange([value])}
              value={field.value[0]}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select location' />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.preferredLocations && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.preferredLocations.message}
          </p>
        )}
      </div>

      <div>
        <Label>Property Types</Label>
        <Controller
          name='propertyTypes'
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange([value])}
              value={field.value[0]}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select property type' />
              </SelectTrigger>
              <SelectContent>
                {propertyTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.propertyTypes && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.propertyTypes.message}
          </p>
        )}
      </div>

      <Controller
        name='note'
        control={control}
        render={({ field }) => (
          <CustomInput
            id='note'
            label='Note'
            placeholder='Enter Note'
            type='textarea'
            {...field}
          />
        )}
      />

      <Button
        type='submit'
        variant='outline'
        className='w-full bg-[#42a4ae] text-white'
        disabled={!isValid}
      >
        Submit
      </Button>
    </form>
  );
};

export default LeadForm;
