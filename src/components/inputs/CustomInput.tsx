
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomInputInterface
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?:string
  required?: boolean;
  unit?: string;
  customunit?: boolean;
}

const CustomInput = ({
  label,
  required = false,
  unit,
  customunit,
  ...props
}: CustomInputInterface) => {

  return (
    <div className='relative'>
      {label && 
        <Label className='text-lg font-bold'>
              {label} {required && <span className='text-red-500'>*</span>}
        </Label>
      }
      
      <Input
        {...props}
        className='placeholder:text-slate-700  block w-full mt-2 px-4 sm:text-md rounded-md focus-visible:border-[#42a4ae] ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow'
      />

      {unit && (
        <div className='absolute inset-y-0 right-0 flex items-center pointer-events-none text-sm text-gray-600'>
          <span>{unit}</span>
        </div>
      )}

      {customunit && unit && (
        <div className='absolute inset-y-0 right-0 flex items-center pointer-events-none text-sm gap-2 text-gray-600'>
          {props.value}
          <span>{unit}</span>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
