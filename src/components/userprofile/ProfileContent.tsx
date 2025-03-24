'use client';

import {
  LayoutDashboard,
  ListIcon,
  PlusIcon,
  SettingsIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import ProfileForm from '@/components/profile/ProfileForm';
import SettingsPage from '@/components/settings/SettingsPage';
import { Button } from '@/components/ui/button';
import SaveSearchList from '@/components/userprofile/SaveSearchList';

import store from '@/redux/store';

import ProfileFavoriteCards from '../userprofile/ProfileFavoriteCards';

const BrokerContent = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  useEffect(() => {
    setActiveTab(section || '');
  }, [section]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Provider store={store}>
      <div className='sticky top-0 z-10 lg:mx-24 mx-4'>
        <div className='flex items-center md:justify-center gap-4 border-b px-4 py-2 shadow-sm overflow-x-auto'>
          <Button
            className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
              activeTab === 'profile' ? 'text-gray-800 bg-[#93bbfd]' : ''
            }`}
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => handleTabChange('profile')}
          >
            <LayoutDashboard className='mr-2 h-4 w-4' />
            Profile
          </Button>

          <Button
            className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
              activeTab === 'favorites' ? 'text-gray-800 bg-[#93bbfd]' : ''
            }`}
            variant={activeTab === 'favorites' ? 'default' : 'outline'}
            onClick={() => handleTabChange('favorites')}
          >
            <ListIcon className='mr-2 h-4 w-4' />
            Favorites
          </Button>

          <Button
            className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
              activeTab === 'savedsearch' ? 'text-gray-800 bg-[#93bbfd]' : ''
            }`}
            variant={activeTab === 'savedsearch' ? 'default' : 'outline'}
            onClick={() => handleTabChange('savedsearch')}
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            Saved Search
          </Button>

          <Button
            className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
              activeTab === 'settings' ? 'text-gray-800 bg-[#93bbfd]' : ''
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
          {activeTab === 'savedsearch' && <SaveSearchList />}
          {activeTab === 'settings' && (
            <SettingsPage handleTabChange={handleTabChange} />
          )}
        </div>
      </div>
    </Provider>
  );
};

export default BrokerContent;
