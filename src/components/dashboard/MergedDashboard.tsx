'use client';

import axios from 'axios';
import { Clock, Package, TrendingDown, TrendingUp, User2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import useAuth from '@/hooks/useAuth';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Types for the card data and the data fetched from the API
interface CardData {
  title: string;
  value: string;
  trendStatus: 'up' | 'down';
  trend: string;
  icon: React.ReactNode;
  trendColor: string;
}

interface ApiData {
  activeListings: number;
  inActiveListings: number;
  activeLeads: number;
  inActiveLeads: number;
}

const MergedDashboard: React.FC = () => {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('October');
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiData>(
          'https://api.houzie.in/broker/stats',
          {
            headers: {
              Authorization: `Bearer ${auth?.accessToken}`,
            },
          }
        );
        const data = response.data;

        const newCardData: CardData[] = [
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
        console.error('Error fetching data:');
      }
    };

    fetchData();
  }, [auth?.accessToken]);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const formatValue = (value: number): string => `${value * 100}%`;

  const data = [
    { name: '5k', value: 30 },
    { name: '7.5k', value: 35 },
    { name: '10k', value: 40 },
    { name: '12.5k', value: 60 },
    { name: '15k', value: 50 },
    { name: '17.5k', value: 62 },
    { name: '20k', value: 100 },
    { name: '22.5k', value: 60 },
    { name: '25k', value: 62 },
    { name: '27.5k', value: 60 },
    { name: '30k', value: 62 },
    { name: '32.5k', value: 60 },
    { name: '35k', value: 62 },
    { name: '37.5k', value: 35 },
    { name: '40k', value: 40 },
    { name: '42.5k', value: 80 },
    { name: '45k', value: 50 },
    { name: '47.5k', value: 70 },
    { name: '50k', value: 75 },
    { name: '52.5k', value: 68 },
    { name: '55k', value: 62 },
    { name: '57.5k', value: 65 },
    { name: '60k', value: 65 },
  ];

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
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
                  className={`text-xs mt-1 flex justify-start gap-1 items-center ${card.trendColor}`}
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

        <div className='md:col-span-2 lg:col-span-2'>
          <Card className='bg-white shadow-2xl'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-2xl font-semibold'>
                Deals Overview
              </CardTitle>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select month' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='January'>January</SelectItem>
                  <SelectItem value='February'>February</SelectItem>
                  <SelectItem value='March'>March</SelectItem>
                  <SelectItem value='April'>April</SelectItem>
                  <SelectItem value='May'>May</SelectItem>
                  <SelectItem value='June'>June</SelectItem>
                  <SelectItem value='July'>July</SelectItem>
                  <SelectItem value='August'>August</SelectItem>
                  <SelectItem value='September'>September</SelectItem>
                  <SelectItem value='October'>October</SelectItem>
                  <SelectItem value='November'>November</SelectItem>
                  <SelectItem value='December'>December</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className='pl-2'>
              <ResponsiveContainer width='100%' height={300}>
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='#4379EE' stopOpacity={0.5} />
                      <stop offset='100%' stopColor='#4379EE' stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    tickFormatter={formatValue}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value * 100}%`, 'Value']}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='#4379EE'
                    fill='url(#colorValue)'
                    dot={{ strokeWidth: 2, r: 4, fill: '#4379EE' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className='md:col-span-2 lg:col-span-2'>
          <Card className='bg-white shadow-2xl'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-2xl font-semibold'>
                Listing Views
              </CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <ResponsiveContainer width='100%' height={300}>
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id='colorValue2'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#FF5733' stopOpacity={0.5} />
                      <stop offset='100%' stopColor='#FF5733' stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    tickFormatter={formatValue}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value * 100}%`, 'Value']}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='#FF5733'
                    fill='url(#colorValue2)'
                    dot={{ strokeWidth: 2, r: 4, fill: '#FF5733' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MergedDashboard;
