'use client';

import {
  LayoutDashboard,
  ListIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { useLocationTracker } from '@/hooks/useLocationTracker';

import AddListings from '@/components/AddListings/AddListings';
import Dashboard from '@/components/dashboard/Dashboard';
import Mylistings from '@/components/Mylistings/Mylistings';
import ProfileForm from '@/components/profile/ProfileForm';
import SettingsPage from '@/components/settings/SettingsPage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import store from '@/redux/store';

const BrokerContent = () => {
  const { isNearGurugram, locationChecked, permissionGranted } =
    useLocationTracker();

  const handleClose = () => setIsDialogOpen(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (locationChecked && permissionGranted && !isNearGurugram) {
      setIsDialogOpen(true);
    }
  }, [locationChecked, isNearGurugram, permissionGranted]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Provider store={store}>
        <div className='sticky top-0 z-10 lg:mx-24 mx-4'>
          <div className='flex items-center md:justify-center gap-4 border-b px-4 py-2 shadow-sm overflow-x-auto'>
            <Button
              className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center  ${
                activeTab === 'dashboard' ? 'text-gray-800 bg-[#93bbfd]' : ''
              }`}
              variant='ghost'
              onClick={() => handleTabChange('dashboard')}
            >
              <LayoutDashboard className='mr-2 h-4 w-4' />
              Dashboard
            </Button>

            <Button
              className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
                activeTab === 'myListing' ? 'text-gray-800 bg-[#93bbfd]' : ''
              }`}
              variant='ghost'
              onClick={() => handleTabChange('myListing')}
            >
              <ListIcon className='mr-2 h-4 w-4' />
              My Listing
            </Button>

            <Button
              className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
                activeTab === 'addListing' ? 'text-gray-800 bg-[#93bbfd]' : ''
              }`}
              variant='ghost'
              onClick={() => handleTabChange('addListing')}
            >
              <PlusIcon className='mr-2 h-4 w-4' />
              Add New Listing
            </Button>

            <Button
              className={` rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
                activeTab === 'profile' ? 'text-gray-800 bg-[#93bbfd]' : ''
              }`}
              variant='ghost'
              onClick={() => handleTabChange('profile')}
            >
              <UserIcon className='mr-2 h-4 w-4' />
              Profile
            </Button>

            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  className={`rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
                    activeTab === 'profile' ? 'text-gray-800 bg-[#93bbfd]' : ''
                  }`}
                  variant='ghost'
                >
                  <UserIcon className='mr-2 h-4 w-4' />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px] shadow-md'>
                <ProfileForm />
              </DialogContent>
            </Dialog> */}

            <Button
              className={`rounded-xl hover:text-gray-800 hover:bg-[#D3E3FC] text-gray-600 bg-transparent flex items-center ${
                activeTab === 'settings' ? 'text-gray-800 bg-[#93bbfd]' : ''
              }`}
              variant='ghost'
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
            {activeTab === 'profile' && <ProfileForm />}
            {activeTab === 'settings' && (
              <SettingsPage handleTabChange={handleTabChange} />
            )}
          </div>
        </div>
      </Provider>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Location Notice</DialogTitle>
            <DialogDescription>
              Our services are optimized for users near Gurugram. It seems
              you're currently outside the service area.<br></br> While Adding
              property Please select location manually Thank You
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BrokerContent;
