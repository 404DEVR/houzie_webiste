'use client';

import React, { type ReactNode } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PopoverCardProps {
  trigger: ReactNode;
  content: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  width?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

const PopoverCard = ({
  trigger,
  content,
  position = 'bottom',
  align = 'center',
  width = 'w-80',
  onOpenChange,
  open,
}: PopoverCardProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  return (
    <>
      {(open !== undefined ? open : isOpen) && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
          onClick={() => handleOpenChange(false)}
        />
      )}

      <Popover
        open={open !== undefined ? open : isOpen}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger asChild>
          <div className='relative z-50'>{trigger}</div>
        </PopoverTrigger>
        <PopoverContent
          className={`${width} shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-white/20 z-50 p-0`}
          align={align}
          side={position}
          sideOffset={20}
        >
          <div className='p-4 bg-white rounded-lg'>{content}</div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverCard;
