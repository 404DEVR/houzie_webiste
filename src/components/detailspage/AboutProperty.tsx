import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutProperty = () => {
  return (
    <Card className='overflow-hidden mt-7 bg-[#FFFFFF]'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-2xl font-semibold leading-9'>
          About Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-base font-medium mt-5 text-[#4a4a4a] leading-6'>
          It is near to main shopping hub like atta market, sector-18 market,
          dlf mall and is in the first few sector, if you are coming from delhi
          (From dnd side). It has school, hospital, metro, market, it has
          everything at walking distance. We have many more such options. Please
          call us to get transparent and honest deal.
        </p>
      </CardContent>
    </Card>
  );
};

export default AboutProperty;
