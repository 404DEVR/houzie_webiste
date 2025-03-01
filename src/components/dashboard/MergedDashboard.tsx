'use client';

import axios from 'axios';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BsBuildingsFill } from 'react-icons/bs';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { MdPeopleAlt } from 'react-icons/md';
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

import { ApiData, CardData } from '@/interfaces/Interface';

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
            title: 'Active Leads',
            value: data.activeLeads.toString(),
            trendStatus: 'up',
            trend: 'Leads generated recently',
            bgcolor: 'bg-[#bcd5f4] text-[#2c7bdb]',
            icon: <FaClockRotateLeft className='w-6 h-6 ' />,
            trendColor: 'text-green-500',
          },
          {
            title: 'Inactive Leads',
            value: data.inActiveLeads.toString(),
            trendStatus: 'down',
            bgcolor: 'bg-[#ffe7de] text-[#ff9066]',
            trend: 'Leads not followed up',
            icon: <MdPeopleAlt className='w-6 h-6 ' />,
            trendColor: 'text-red-500',
          },
          {
            title: 'Active Listings',
            value: data.activeListings.toString(),
            trendStatus: 'up',
            trend: 'New listings added',
            bgcolor: 'bg-[#bcd5f4] text-[#2c7bdb]',
            icon: <BsBuildingsFill className='w-6 h-6 ' />,
            trendColor: 'text-green-500',
          },
          {
            title: 'Inactive Listings',
            value: data.inActiveListings.toString(),
            trendStatus: 'down',
            trend: 'No new listings',
            bgcolor: 'bg-[#ffe7de] text-[#ff9066]',
            icon: <BsBuildingsFill className='w-6 h-6 ' />,
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
    <div className='mx-auto pt-6 '>
      <div className='grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-5 gap-6'>
        <div className='lg:col-span-4'>
          <Card className='bg-white shadow-2xl shadow-[#dadbe5] rounded-xl'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-semibold'>
                Leads Overview
              </CardTitle>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className='w-[120px] md:w-[180px]'>
                  {' '}
                  {/* Adjusted width for responsiveness */}
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
        <div className='lg:col-span-2 xl:col-span-1 flex flex-col gap-4 items-center justify-center'>
          {cardData.slice(0, 2).map((card, index) => (
            <Card
              key={index}
              className='shadow-xl bg-white shadow-[#dadbe5] rounded-xl border w-full'
            >
              <CardHeader className='flex flex-col items-start space-y-2 pb-2'>
                <div className='flex items-center justify-between w-full'>
                  <div>
                    <CardTitle className='text-sm font-medium leading-5 mb-4 text-gray-500'>
                      {card.title}
                    </CardTitle>
                    <div className='text-2xl font-bold'>{card.value}</div>
                  </div>
                  <div className={`rounded-xl ${card.bgcolor} p-4`}>
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pt-6'>
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
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-5 gap-6 mt-6'>
        <div className='lg:col-span-2 xl:col-span-1 flex flex-col gap-4 items-center justify-center'>
          {cardData.slice(2, 4).map((card, index) => (
            <Card
              key={index}
              className='shadow-xl bg-white shadow-[#dadbe5] rounded-xl border w-full'
            >
              <CardHeader className='flex flex-col items-start space-y-2 pb-2'>
                <div className='flex items-center justify-between w-full'>
                  <div>
                    <CardTitle className='text-sm font-medium leading-5 mb-4 text-gray-500'>
                      {card.title}
                    </CardTitle>
                    <div className='text-2xl font-bold'>{card.value}</div>
                  </div>
                  <div
                    className={`rounded-xl ${card.bgcolor} text-[#2c7bdb] p-4`}
                  >
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pt-6'>
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
        <div className='lg:col-span-4'>
          <Card className='shadow-xl bg-white shadow-[#dadbe5]'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-semibold'>
                Listing Views
              </CardTitle>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className='w-[120px] md:w-[180px]'>
                  {' '}
                  {/* Adjusted width for responsiveness */}
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
