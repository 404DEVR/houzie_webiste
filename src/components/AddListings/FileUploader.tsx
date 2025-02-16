import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  removeAddPhoto,
  setAddPhotos,
  updateAddPropertyDetails,
} from '@/redux/slices/formslices';
import { RootState } from '@/redux/store';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface FileUploaderprops {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
}

const FileUploader = ({ handleNext, handleBack }: FileUploaderprops) => {
  const dispatch = useDispatch();
  const photos = useSelector((state: RootState) => state.addForm.photos);
  const mainImage = useSelector(
    (state: RootState) => state.addForm.propertyDetails.mainImage
  );
  const [isUploading, setIsUploading] = useState(false);

  const uploadToSupabase = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const url = await uploadToSupabase(file);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            preview: url,
          };
        });

        const uploadedPhotos = await Promise.all(uploadPromises);
        const uniquePhotos = uploadedPhotos.filter(
          (newPhoto) =>
            !photos.some(
              (existingPhoto) => existingPhoto.preview === newPhoto.preview
            )
        );
        const updatedPhotos = [...photos, ...uniquePhotos];
        dispatch(setAddPhotos(updatedPhotos));

        if (!mainImage && updatedPhotos.length > 0) {
          dispatch(
            updateAddPropertyDetails({ mainImage: updatedPhotos[0].preview })
          );
        }

        toast({
          title: 'Images uploaded successfully',
          description: `${uniquePhotos.length} new image(s) added`,
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Error uploading image(s)',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [dispatch, photos, mainImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { 'image/*': ['.jpeg', '.png'] },
  });

  const handleRemovePhoto = async (index: number) => {
    const photoToRemove = photos[index];
    dispatch(removeAddPhoto(index));

    // If the removed photo was the main image, set a new main image
    if (photoToRemove.preview === mainImage) {
      const newMainImage =
        photos.length > 1 ? photos[index === 0 ? 1 : 0].preview : '';
      dispatch(updateAddPropertyDetails({ mainImage: newMainImage }));
    }

    try {
      const fileName = photoToRemove.preview.split('/').pop() || '';
      const { error } = await supabase.storage
        .from('property-images')
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: 'Photo removed successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error removing photo',
        description:
          'The photo was removed from the form but may still exist in storage.',
        variant: 'destructive',
      });
    }
  };

  const handleSetMainImage = (preview: string) => {
    dispatch(updateAddPropertyDetails({ mainImage: preview }));
  };

  const handleSubmit = () => {
    handleNext();
  };

  return (
    <Card className='rounded-xl bg-white md:p-8 shadow-sm max-w-4xl my-6 mx-auto border'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Upload Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`rounded-md p-8 text-center cursor-pointer border flex flex-col items-center justify-center border-dashed ${
            isDragActive
              ? 'bg-blue-50 border-blue-500'
              : 'bg-gray-100 border-gray-300'
          }`}
          style={{ minHeight: '200px' }}
        >
          <input {...getInputProps()} />
          <div>
            <Image
              src='/svg/upload image.svg'
              alt='Upload Image'
              width={80}
              height={80}
              className='object-contain mx-auto mb-2'
            />
            <p className='text-gray-500'>Drag and drop images here</p>
            <div className='my-2 text-gray-400'>or</div>
            <Button
              variant='outline'
              className='border-blue-500 text-blue-500 w-full'
            >
              Browse
            </Button>
          </div>
        </div>

        {isUploading && <p className='mt-4 text-center'>Uploading images...</p>}

        {photos.length > 0 && (
          <div className='mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4'>
            {photos.map((photo, index) => (
              <div key={index} className='relative'>
                <Image
                  src={photo.preview}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className='object-cover rounded-md w-full h-40'
                />
                <div className='absolute top-2 right-2 flex flex-col gap-2'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleRemovePhoto(index)}
                  >
                    Remove
                  </Button>
                  {photo.preview !== mainImage && (
                    <Button
                      variant='secondary'
                      size='sm'
                      onClick={() => handleSetMainImage(photo.preview)}
                    >
                      Set as Main
                    </Button>
                  )}
                </div>
                {photo.preview === mainImage && (
                  <div className='absolute top-2 left-2 bg-[#42A4AE] text-white px-2 py-1 rounded-md text-sm'>
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className='flex flex-col-reverse gap-y-4 md:flex-row justify-end items-center gap-x-4 mt-6'>
        <Button
          onClick={handleBack}
          variant='outline'
          className='border-2 border-[#42A4AE] text-[#42A4AE] w-full md:w-auto'
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className='bg-[#42A4AE] text-white px-6 py-3 rounded-lg w-full md:w-auto'
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
