import { Clock, Package, TrendingDown, TrendingUp, User2 } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardCards = () => {
  const cardData = [
    {
      title: 'New leads',
      value: '40,689',
      trendStatus: 'up',
      trend: '8.5% Up from yesterday',
      icon: <User2 className='h-10 w-10 text-blue-500' />,
      trendColor: 'text-green-500',
    },
    {
      title: 'Pending leads',
      value: '40,689',
      trendStatus: 'up',
      trend: '1.3% Up from past week',
      icon: <Clock className='h-10 w-10 text-orange-500' />,
      trendColor: 'text-green-500',
    },
    {
      title: 'Follows up',
      value: '40,689',
      trendStatus: 'down',
      trend: '4.3% Down from yesterday',
      icon: <Package className='h-10 w-10 text-yellow-500' />,
      trendColor: 'text-red-500',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-4'>
      {cardData.map((card, index) => (
        <Card key={index} className='shadow-2xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium leading-8'>
              {card.title}
              <div className='text-2xl font-bold'>{card.value}</div>
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-xs mt-1 flex justify-start gap-1 items-center',
                card.trendColor
              )}
            >
              {card.trendStatus === 'up' ? (
                <TrendingUp className='text-xs w-4 h-4' />
              ) : (
                <TrendingDown className='text-xs w-4 h-4' />
              )}
              {card.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;
