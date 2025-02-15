'use client';

import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const DashboardGraph = () => {
  const [selectedMonth, setSelectedMonth] = useState('October');

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const formatValue = (value) => `${value * 100}%`;

  return (
    <Card className='bg-white shadow-2xl my-6'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-2xl font-semibold '>Deals</CardTitle>
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
                <stop
                  offset='0%'
                  stopColor='#4379EE
'
                  stopOpacity={0.5}
                />
                <stop
                  offset='100%'
                  stopColor='#4379EE
'
                  stopOpacity={0}
                />
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
            <Tooltip formatter={(value: any) => [`${value * 100}%`, 'Value']} />
            <Area
              type='monotone'
              dataKey='value'
              stroke='#4379EE
'
              fill='url(#colorValue)'
              dot={{ strokeWidth: 2, r: 4, fill: '#4379EE' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardGraph;
