'use client';

import {
  LayoutDashboard,
  ListIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Provider } from 'react-redux';

import AddListings from '@/components/AddListings/AddListings';
import Dashboard from '@/components/dashboard/Dashboard';
import Mylistings from '@/components/Mylistings/Mylistings';
import ProfileForm from '@/components/profile/ProfileForm';
import SettingsPage from '@/components/settings/SettingsPage';
import { Button } from '@/components/ui/button';

import store from '@/redux/store';

const Page = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Provider store={store}>
      <div className='sticky top-0 bg-white z-10 lg:mx-24 mx-4'>
        <div className='flex items-center justify-start gap-4 border-b px-4 py-2 shadow-sm overflow-x-auto'>
          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'dashboard' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => handleTabChange('dashboard')}
          >
            <LayoutDashboard className='mr-2 h-4 w-4' />
            Dashboard
          </Button>

          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'myListing' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'myListing' ? 'default' : 'outline'}
            onClick={() => handleTabChange('myListing')}
          >
            <ListIcon className='mr-2 h-4 w-4' />
            My Listing
          </Button>

          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'addListing' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'addListing' ? 'default' : 'outline'}
            onClick={() => handleTabChange('addListing')}
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            Add New Listing
          </Button>

          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'profile' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => handleTabChange('profile')}
          >
            <UserIcon className='mr-2 h-4 w-4' />
            Profile
          </Button>

          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'settings' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => handleTabChange('settings')}
          >
            <SettingsIcon className='mr-2 h-4 w-4' />
            Settings
          </Button>
        </div>

        <div className='p-4'>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'myListing' && <Mylistings />}
          {activeTab === 'addListing' && (
            <AddListings setActiveTab={setActiveTab} />
          )}
          {activeTab === 'profile' && (
            <ProfileForm handleTabChange={handleTabChange} />
          )}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </Provider>
  );
};

export default Page;
