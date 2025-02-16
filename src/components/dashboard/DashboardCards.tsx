import { Clock, Package, TrendingDown, TrendingUp, User2 } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';

interface CardsInterface {
  title: string;
  value: string;
  trendStatus: string;
  trend: string;
  icon: ReactNode;
  trendColor: string;
}

const DashboardCards = () => {
  const [cardData, setCardData] = useState<CardsInterface[]>([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.houzie.in/broker/stats', {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        });
        const data = response.data;

        const newCardData = [
          {
            title: 'Active Listings',
            value: data.activeListings.toString(),
            trendStatus: 'up',
            trend: 'New listings added',
            icon: <User2 className='h-10 w-10 text-blue-500' />,
            trendColor: 'text-green-500',
          },
          {
            title: 'Inactive Listings',
            value: data.inActiveListings.toString(),
            trendStatus: 'down',
            trend: 'No new listings',
            icon: <Clock className='h-10 w-10 text-orange-500' />,
            trendColor: 'text-red-500',
          },
          {
            title: 'Active Leads',
            value: data.activeLeads.toString(),
            trendStatus: 'up',
            trend: 'Leads generated recently',
            icon: <Package className='h-10 w-10 text-yellow-500' />,
            trendColor: 'text-green-500',
          },
          {
            title: 'Inactive Leads',
            value: data.inActiveLeads.toString(),
            trendStatus: 'down',
            trend: 'Leads not followed up',
            icon: <Package className='h-10 w-10 text-yellow-500' />,
            trendColor: 'text-red-500',
          },
        ];

        setCardData(newCardData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
