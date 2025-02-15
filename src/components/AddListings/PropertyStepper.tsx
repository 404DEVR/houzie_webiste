// components/Stepper.tsx
import React from 'react';

import { cn } from '@/lib/utils'; // Assuming you have a utils file for class name merging

import { Button } from '@/components/ui/button'; // Importing Button component from Shadcn UI

interface Step {
  id: number;
  label: string;
  status: 'inProgress' | 'pending' | 'complete';
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className='w-full rounded-md border border-gray-200 bg-white p-8 shadow-sm'>
      <div className='flex items-center justify-between'>
        {steps.map((step) => (
          <div key={step.id} className='flex flex-col items-center'>
            <div className='flex items-center'>
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2  font-medium',
                  step.id === currentStep
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-500'
                )}
              >
                {step.id}
              </div>
              {step.id < steps.length && (
                <div
                  className={cn(
                    'h-0.5 w-20 bg-gray-300',
                    step.id < currentStep ? 'bg-green-500' : ''
                  )}
                />
              )}
            </div>
            <div className='mt-2 w-24 text-center text-sm font-medium text-gray-700'>
              {step.label}
            </div>
            <Button
              variant='outline'
              size='sm'
              className={cn(
                'mt-1.5 w-24 rounded-full text-xs',
                step.status === 'inProgress'
                  ? 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              )}
              disabled={step.status === 'inProgress'}
            >
              {step.status === 'inProgress'
                ? 'In Progress'
                : step.status === 'complete'
                ? 'Complete'
                : 'Pending'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
