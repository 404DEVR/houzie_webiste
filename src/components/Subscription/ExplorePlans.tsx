import { motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MonthlyplansData = [
  {
    name: 'Classic Plan',
    price: 300,
    isPopular: true,
    features: [
      '15h Fast generations',
      'Unlimited Relaxed generations',
      'General commercial terms',
      'Access to member gallery',
      'Optional credit top ups',
    ],
  },
  {
    name: 'Standard Plan',
    price: 600,
    isPopular: false,
    features: [
      '30h Fast generations',
      'Unlimited Relaxed generations',
      'General commercial terms',
      'Access to member gallery',
      'Optional credit top ups',
    ],
  },
  {
    name: 'Premium Plan',
    price: 1200,
    isPopular: false,
    features: [
      '60h Fast generations',
      'Unlimited Relaxed generations',
      'General commercial terms',
      'Access to member gallery',
      'Optional credit top ups',
    ],
  },
];

const YearlyplansData = [
  {
    name: 'Classic Plan',
    price: 900,
    isPopular: true,
    features: [
      '15h Fast generations',
      'Unlimited Relaxed generations',
      'General commercial terms',
      'Access to member gallery',
      'Optional credit top ups',
    ],
  },
  {
    name: 'Standard Plan',
    price: 1200,
    isPopular: false,
    features: [
      '30h Fast generations',
      'Unlimited Relaxed generations',
      'General commercial terms',
      'Access to member gallery',
      'Optional credit top ups',
    ],
  },
  {
    name: 'Premium Plan',
    price: 2000,
    isPopular: false,
    features: [
      '60h Fast generations',
      'Unlimited Relaxed generations',
      'General commercial terms',
      'Access to member gallery',
      'Optional credit top ups',
    ],
  },
];

const tabContentVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const ExplorePlans = ({ onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState('Classic Plan');

  const handlePlanClick = (planName) => {
    setSelectedPlan(planName);
  };

  return (
    <div className='bg-gray-50 min-h-screen py-2 max-w-5xl mx-auto'>
      <div className='container mx-auto px-4'>
        <div className='flex gap-6 justify-center items-center'>
          <h1 className='text-4xl font-bold text-center mb-4'>
            Purchase a subscription
          </h1>
          <Button
            onClick={onBack}
            className='mb-4 bg-gray-200 text-gray-700 hover:bg-gray-300'
          >
            <ChevronLeft className='mr-2' /> Back to Profile
          </Button>
        </div>

        <p className='text-gray-600 text-md text-center mb-8'>
          Choose the plan that works for you.
        </p>
        <Tabs defaultValue='monthly' className='w-full'>
          <div className='flex justify-center w-full'>
            <TabsList className='max-w-2xl mx-auto text-center bg-[#ebeff0] p-1 rounded-full'>
              <TabsTrigger
                value='monthly'
                className='rounded-full px-6 py-1.5 data-[state=active]:bg-[#1e4e8a] data-[state=active]:text-white transition-all duration-300'
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value='yearly'
                className='rounded-full px-6 py-1.5 data-[state=active]:bg-[#1e4e8a] data-[state=active]:text-white transition-all duration-300'
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='monthly'>
            <motion.div
              variants={tabContentVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20'
            >
              {MonthlyplansData.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-3xl shadow-md h-full  border hover:shadow-lg  cursor-pointer transition-all duration-500 ease-in-out ${
                    selectedPlan === plan.name
                      ? 'transform scale-105 p-2 bg-[#bad2f8]  relative -translate-y-10 '
                      : 'bg-[#eff5ff] '
                  }`}
                  onClick={() => handlePlanClick(plan.name)}
                >
                  <div
                    className={` ${
                      selectedPlan === plan.name
                        ? 'bg-[#1e4e8a] rounded-3xl text-white'
                        : ''
                    } p-6 flex flex-col justify-between h-full transition-colors duration-100 `}
                  >
                    <div className='mb-4'>
                      <div className='flex justify-between items-center  '>
                        <div className='font-semibold'>{plan.name}</div>
                        {plan.isPopular && (
                          <div className='text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-md inline-block'>
                            Most Popular
                          </div>
                        )}
                      </div>
                      <div className='text-4xl font-bold my-4 flex gap-2'>
                        ₹{plan.price}{' '}
                        <div className='text-xs text-[#b9bec1] font-normal flex flex-col justify-center items-start '>
                          <span>/month</span>
                          <span>billed monthly</span>
                        </div>
                      </div>
                      <ul className='mb-4 space-y-2'>
                        {plan.features.map((feature, i) => (
                          <li key={i} className='flex items-center'>
                            <Check
                              className={`w-4 h-4 mr-2 text-gray-500 rounded-full p-0.5 ${
                                selectedPlan === plan.name
                                  ? 'bg-[#3b8ff6] text-white'
                                  : 'bg-[#ebeff0] text-[#b9bec1]'
                              } `}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className='w-full rounded-xl bg-[#dbebfe] text-[#173254] '>
                      Choose Plan
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          </TabsContent>
          <TabsContent value='yearly'>
            <motion.div
              variants={tabContentVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20'
            >
              {YearlyplansData.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-3xl shadow-md h-full  border hover:shadow-lg  cursor-pointer transition-all duration-500 ease-in-out ${
                    selectedPlan === plan.name
                      ? 'transform scale-105 p-2 bg-[#bad2f8]  relative -translate-y-10 '
                      : 'bg-[#eff5ff] '
                  }`}
                  onClick={() => handlePlanClick(plan.name)}
                >
                  <div
                    className={` ${
                      selectedPlan === plan.name
                        ? 'bg-[#1e4e8a] rounded-3xl text-white'
                        : ''
                    } p-6 flex flex-col justify-between h-full transition-colors duration-100 `}
                  >
                    <div className='mb-4'>
                      <div className='flex justify-between items-center  '>
                        <div className='font-semibold'>{plan.name}</div>
                        {plan.isPopular && (
                          <div className='text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-md inline-block'>
                            Most Popular
                          </div>
                        )}
                      </div>
                      <div className='text-4xl font-bold my-4 flex gap-2'>
                        ₹{plan.price}{' '}
                        <div className='text-xs text-[#b9bec1] font-normal flex flex-col justify-center items-start '>
                          <span>/year</span>
                          <span>billed monthly</span>
                        </div>
                      </div>
                      <ul className='mb-4 space-y-2'>
                        {plan.features.map((feature, i) => (
                          <li key={i} className='flex items-center'>
                            <Check
                              className={`w-4 h-4 mr-2 text-gray-500 rounded-full p-0.5 ${
                                selectedPlan === plan.name
                                  ? 'bg-[#3b8ff6] text-white'
                                  : 'bg-[#ebeff0] text-[#b9bec1]'
                              } `}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className='w-full rounded-xl bg-[#dbebfe] text-[#173254] '>
                      Choose Plan
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExplorePlans;
