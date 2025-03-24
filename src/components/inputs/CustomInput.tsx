import styles from './CustomInput.module.css';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomInputInterface
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  unit?: string;
  customunit?: boolean;
  error?: string;
  firstUnit?: string;
  variant?: string;
}

const CustomInput = ({
  label,
  firstUnit,
  required = false,
  unit,
  customunit,
  error,
  variant,
  ...props
}: CustomInputInterface) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  };

  return (
    <div className='relative'>
      {label && (
        <Label
          className={`${
            variant === 'small' ? 'text-md' : 'text-md'
          } text-black font-normal`}
        >
          {label} {required && <span className='text-red-500'>*</span>}
        </Label>
      )}

      {firstUnit && (
        <div className='absolute inset-y-0 left-2 top-1 flex items-center pointer-events-none text-sm text-gray-600'>
          <span>{firstUnit}</span>
        </div>
      )}
      <Input
        {...props}
        onKeyDown={handleKeyDown}
        className={`placeholder:text-[#646464] text-[#646464] block w-full ${
          variant === 'small' ? 'mt-0' : 'mt-1'
        } ${
          firstUnit ? 'pl-5 pr-4' : 'px-4'
        }  sm:text-md rounded-md focus-visible:border-[#bfd7fe] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow ${
          styles.noSpinners
        }`}
      />

      {unit && (
        <div className='absolute inset-y-0 right-2 flex items-center pointer-events-none text-sm text-gray-600'>
          <span>{unit}</span>
        </div>
      )}

      {customunit && unit && (
        <div className='absolute inset-y-0 right-0 flex items-center pointer-events-none text-sm gap-2 text-gray-600'>
          {props.value}
          <span>{unit}</span>
        </div>
      )}
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
  );
};

export default CustomInput;
