import { ArrowLeft, Bath, Bed, Copy } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RiShareForwardLine } from 'react-icons/ri';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useFavorites from '@/hooks/UseFavorites';

import { Badge } from '@/components/ui/badge';
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

import { PropertyFeature } from '@/interfaces/Interface';
import { HeaderContainerprops } from '@/interfaces/PropsInterface';

export default function HeaderContainer({
  propertyData,
  setIsLoading,
  address,
  setAddress,
}: HeaderContainerprops) {
  const toast = useCustomToast();
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');
  const { handleFavoriteClick, isListingInFavorites } = useFavorites([]);

  useEffect(() => {
    if (propertyData?.id) {
      setCurrentUrl(`${window.location.origin}/property/${propertyData.id}`);
    }
  }, [propertyData?.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.info({
        title: 'Copied!',
        description: 'Link copied to clipboard.',
      });
    } catch (err) {
      toast.error({
        title: 'Copy failed',
        description: 'Failed to copy link. Please try again.',
      });
    }
  };

  const propertyFeatures: PropertyFeature[] = [
    ...(propertyData.bedrooms !== 0 && propertyData.bedrooms !== null
      ? [{ icon: Bed, label: `${propertyData.bedrooms} Bed Room` }]
      : []),
    ...(propertyData.bathrooms !== 0 && propertyData.bathrooms !== null
      ? [{ icon: Bath, label: `${propertyData.bathrooms} Bath Room` }]
      : []),
  ];

  const fetchAddress = async (location) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.results && data.results.length > 0 && setAddress) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    fetchAddress(propertyData.location);
  }, []);

  return (
    <header className='flex flex-col items-start justify-between w-full gap-2 pb-8 pt-2'>
      <div className='flex items-center justify-between w-full'>
        {/* Back to Listings Button */}
        <Button
          onClick={() => router.push('/property')}
          size='custom'
          className='flex items-center gap-2 focus-visible:border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
        >
          <div className='rounded-full border-2 p-1.5'>
            <ArrowLeft className='w-4 h-4  ' />
          </div>
          Back to Listings
        </Button>

        <div className='flex items-center gap-4'>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size='custom'
                className='flex items-center gap-2 rounded-full border py-2 px-5'
              >
                <RiShareForwardLine className='w-4 h-4' />
                Share
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
            size='custom'
            className='flex items-center gap-2 rounded-tl-3xl rounded-bl-xl rounded-r-2xl border border-[#e5ddde] pl-5 pr-4 py-2'
            onClick={() => handleFavoriteClick(propertyData)}
          >
            {isListingInFavorites(propertyData.id) ? (
              <>
                <Image
                  src='/svg/heart.svg'
                  alt='/svg/heart.svg'
                  width={25}
                  height={25}
                />
                Favorite
              </>
            ) : (
              <>
                <Image
                  src='/svg/heart fill.svg'
                  alt='public/svg/heart fill.svg'
                  width={25}
                  height={25}
                />
                Favorite
              </>
            )}
          </Button>
          {/* <Button
            size='custom'
            className='flex items-center gap-2 rounded-tl-3xl rounded-bl-xl rounded-r-2xl border border-[#e5ddde] pl-5 pr-4 py-2'
          >
            <Heart className='w-4 h-4 text-red-500' />
          </Button> */}
        </div>
      </div>
      <div className='flex-1 w-full flex justify-between items-end border-b pt-4'>
        <h1 className='font-semibold text-2xl sm:text-[28px] text-black font-inter'>
          {propertyData ? propertyData.title : ''}
        </h1>
        <div className='items-center justify-center flex gap-2'>
          <h1 className='text-base font-normal'>Rent</h1>

          <span className='text-2xl font-semibold'>₹{propertyData.price}</span>
        </div>
      </div>
      <div className='flex justify-start items-start gap-12'>
        <div className='flex flex-col items-start justify-start gap-1 w-auto'>
          <span className='text-sm font-medium'>Feature</span>
          <div className='flex gap-4 items-center justify-start'>
            {propertyFeatures.map((feature, index) => (
              <Badge
                key={index}
                variant='outline'
                className='border-none flex gap-1 p-0 justify-center items-center'
              >
                <feature.icon className='w-[14px] h-[14px]' />
                <span className='font-medium text-xs text-nowrap'>
                  {feature.label}
                </span>
              </Badge>
            ))}
          </div>
        </div>
        <div className='flex flex-col items-start justify-start gap-1 w-full'>
          <span className='text-sm font-medium'>Location</span>
          <div className='flex gap-4 items-center justify-start'>
            <span className='text-xs font-normal '>{address}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
