'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive: 'border-red-500 bg-red-500 text-white',
        error: 'border-red-500 bg-red-500 text-white',
        success: 'border-green-500 bg-green-500 text-white',
        info: 'border-[#729eff] bg-[#729eff] text-white',
        warning: 'border-amber-500 bg-amber-500 text-white',
        premium:
          'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        dark: 'border-gray-800 bg-gray-800 text-white',
        light: 'border-gray-200 bg-gray-100 text-gray-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const CustomToast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toastVariants> & {
      title?: string;
      description?: string;
      icon?: React.ReactNode;
      image?: string;
      onClose?: () => void;
      showProgress?: boolean;
      progress?: number;
    }
>(
  (
    { className, variant, title, description, icon, image, onClose, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className='flex items-center gap-4 w-full'>
          {image && (
            <div className='flex-shrink-0 h-12 w-12 rounded-full overflow-hidden'>
              <img
                src={image || '/placeholder.svg'}
                alt=''
                className='h-full w-full object-cover'
              />
            </div>
          )}
          {icon && !image && (
            <div className='flex-shrink-0 text-white'>{icon}</div>
          )}
          <div className='flex-1 min-w-0'>
            {title && <h4 className='font-semibold text-base'>{title}</h4>}
            {description && (
              <p className='text-sm opacity-90 mt-1'>{description}</p>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className='absolute top-2 right-2 p-1 rounded-md text-foreground/50 opacity-70 transition-opacity hover:text-foreground hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600'
          >
            <X className='h-4 w-4' />
          </button>
        )}
        {props.showProgress && (
          <div className='absolute bottom-0 left-0 h-1 bg-white/30 w-full'>
            <div
              className='h-full bg-white/70 transition-all duration-300'
              style={{ width: `${props.progress || 100}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);
CustomToast.displayName = 'CustomToast';

export { CustomToast, toastVariants };
