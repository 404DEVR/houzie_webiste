import { Copy, Heart, Share } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { HeaderContainerprops } from '@/interfaces/PropsInterface';

export default function HeaderContainer({
  propertyData,
}: HeaderContainerprops) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (propertyData?.id) {
      setCurrentUrl(`${window.location.origin}/property/${propertyData.id}`);
    }
  }, [propertyData?.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className='flex flex-col sm:flex-row items-start justify-between w-full gap-4 sm:gap-6 py-4 sm:py-6'>
      <div className='flex-1 w-full sm:w-auto'>
        <h1 className='font-medium text-2xl sm:text-[32px] leading-tight sm:leading-[48px] text-black font-inter'>
          {propertyData ? propertyData.title : ''}
        </h1>
      </div>

      <div className='flex items-center gap-3 w-auto'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='default'
              className='flex-1 sm:flex-initial items-center gap-2 bg-[#42A4AE] hover:bg-[#3a939c] text-white min-w-[100px] sm:min-w-fit py-2 px-4'
            >
              <Share className='h-4 w-4' />
              <span className='text-sm font-normal hidden sm:inline'>
                Share
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <Label htmlFor='link' className='sr-only'>
                  Link
                </Label>
                <Input id='link' value={currentUrl} readOnly />
              </div>
              <Button
                type='button'
                size='sm'
                className='px-3'
                onClick={copyToClipboard}
              >
                <span className='sr-only'>Copy</span>
                <Copy />
              </Button>
            </div>
            <DialogFooter className='sm:justify-start'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant='default'
          className='flex-1 sm:flex-initial items-center gap-2 bg-[#42A4AE] hover:bg-[#3a939c] text-white min-w-[100px] sm:min-w-fit py-2 px-4'
        >
          <Heart className='h-4 w-4' />
          <span className='text-sm font-normal hidden sm:inline'>
            Faivorite
          </span>
        </Button>
      </div>
    </header>
  );
}
