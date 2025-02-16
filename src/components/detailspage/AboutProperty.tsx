import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Property } from '@/components/detailspage/HeaderContainer';

interface AboutPropertyProps {
  propertyData: Property;
}

const AboutProperty = ({ propertyData }: AboutPropertyProps) => {
  return (
    <Card className='overflow-hidden mt-7 bg-[#FFFFFF]'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-2xl font-semibold leading-9'>
          About Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-base font-medium mt-5 text-[#4a4a4a] leading-6'>
          {propertyData.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default AboutProperty;
