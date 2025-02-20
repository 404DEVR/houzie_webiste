'use client';

import {
  LayoutDashboard,
  ListIcon,
  PlusIcon,
  SettingsIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Provider } from 'react-redux';

import ProfileFavoriteCards from '../userprofile/ProfileFavoriteCards';
import ProfileForm from '@/components/profile/ProfileForm';
import SettingsPage from '@/components/settings/SettingsPage';
import { Button } from '@/components/ui/button';

import store from '@/redux/store';

const BrokerContent = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Provider store={store}>
      <div className='sticky top-0 z-10 lg:mx-24 mx-4'>
        <div className='flex items-center justify-start gap-4 border-b px-4 py-2 shadow-sm overflow-x-auto'>
          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'profile' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => handleTabChange('profile')}
          >
            <LayoutDashboard className='mr-2 h-4 w-4' />
            Profile
          </Button>

          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'favorites' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'favorites' ? 'default' : 'outline'}
            onClick={() => handleTabChange('favorites')}
          >
            <ListIcon className='mr-2 h-4 w-4' />
            Favorites
          </Button>

          <Button
            className={`hover:text-white hover:bg-[#42A4AE]  ${
              activeTab === 'savedsearch' ? 'text-white bg-[#42A4AE]' : ''
            }`}
            variant={activeTab === 'savedsearch' ? 'default' : 'outline'}
            onClick={() => handleTabChange('savedsearch')}
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            Saved Search
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
          {activeTab === 'profile' && <ProfileForm page='user' />}
          {activeTab === 'favorites' && <ProfileFavoriteCards />}
          {activeTab === 'savedsearch' && (
            // <AddListings setActiveTab={setActiveTab} />
            <></>
          )}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </Provider>
  );
};

export default BrokerContent;
