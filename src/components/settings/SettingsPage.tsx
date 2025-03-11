'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    publicProfileVisibility: true,
    shareLocation: true,
    showContactDetails: false,
    saveSearchHistory: true,
    inAppNotifications: true,
    smsAlerts: false,
    dailyPropertySuggestions: true,
    enableLoginAlerts: true,
    saveLoginDevices: false,
    logoutFromOtherDevices: true,
  });

  const handleToggle = (key) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };

  const [isPasswordDropdownOpen, setIsPasswordDropdownOpen] = useState(false);

  const togglePasswordDropdown = () => {
    setIsPasswordDropdownOpen((prev) => !prev);
  };
  return (
    <div className=' mx-auto pb-8 pt-0'>
      <Card className='max-w-2xl mx-auto border-none'>
        <CardContent className='grid gap-6'>
          {/* Account Settings */}
          <div className='space-y-4 border-b-2 pb-4'>
            <h3 className='text-2xl font-semibold mb-4'>Account Settings</h3>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='emailNotifications'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Email Notifications
                <p className='text-xs text-muted-foreground'>
                  Receive updates and property suggestions via email.
                </p>
              </label>
              <Switch
                id='emailNotifications'
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='twoFactorAuth'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Two-Factor Authentication
                <p className='text-xs text-muted-foreground'>
                  Enhance account security with 2FA.
                </p>
              </label>
              <Switch
                id='twoFactorAuth'
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggle('twoFactorAuth')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='publicProfileVisibility'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Public Profile Visibility
                <p className='text-xs text-muted-foreground'>
                  Allow others to view your profile details.
                </p>
              </label>
              <Switch
                id='publicProfileVisibility'
                checked={settings.publicProfileVisibility}
                onCheckedChange={() => handleToggle('publicProfileVisibility')}
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className='space-y-4 border-b-2 pb-4'>
            <h3 className='text-2xl font-semibold mb-4'>Privacy Settings</h3>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='shareLocation'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Share Location with Buyers/Sellers
                <p className='text-xs text-muted-foreground'>
                  Allow others to see your approximate location for better
                  communication.
                </p>
              </label>
              <Switch
                id='shareLocation'
                checked={settings.shareLocation}
                onCheckedChange={() => handleToggle('shareLocation')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='showContactDetails'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Show Contact Details
                <p className='text-xs text-muted-foreground'>
                  Display your phone number and email on property listings.
                </p>
              </label>
              <Switch
                id='showContactDetails'
                checked={settings.showContactDetails}
                onCheckedChange={() => handleToggle('showContactDetails')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='saveSearchHistory'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Save Search History
                <p className='text-xs text-muted-foreground'>
                  Keep a record of your recent searches.
                </p>
              </label>
              <Switch
                id='saveSearchHistory'
                checked={settings.saveSearchHistory}
                onCheckedChange={() => handleToggle('saveSearchHistory')}
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className='space-y-4 border-b-2 pb-4'>
            <h3 className='text-2xl font-semibold mb-4'>
              Notification Preferences
            </h3>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='inAppNotifications'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                In-App Notifications
                <p className='text-xs text-muted-foreground'>
                  Receive notifications for messages, offers, and updates.
                </p>
              </label>
              <Switch
                id='inAppNotifications'
                checked={settings.inAppNotifications}
                onCheckedChange={() => handleToggle('inAppNotifications')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='smsAlerts'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                SMS Alerts
                <p className='text-xs text-muted-foreground'>
                  Receive text message alerts for inquiries and updates.
                </p>
              </label>
              <Switch
                id='smsAlerts'
                checked={settings.smsAlerts}
                onCheckedChange={() => handleToggle('smsAlerts')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='dailyPropertySuggestions'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Daily Property Suggestions
                <p className='text-xs text-muted-foreground'>
                  Get daily recommendations for properties based on your
                  preferences.
                </p>
              </label>
              <Switch
                id='dailyPropertySuggestions'
                checked={settings.dailyPropertySuggestions}
                onCheckedChange={() => handleToggle('dailyPropertySuggestions')}
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className='space-y-4 pb-4'>
            <h3 className='text-2xl font-semibold mb-4'>Security Settings</h3>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='enableLoginAlerts'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Enable Login Alerts
                <p className='text-xs text-muted-foreground'>
                  Get notified of new logins to your account.
                </p>
              </label>
              <Switch
                id='enableLoginAlerts'
                checked={settings.enableLoginAlerts}
                onCheckedChange={() => handleToggle('enableLoginAlerts')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='saveLoginDevices'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Save Login Devices
                <p className='text-xs text-muted-foreground'>
                  Remember devices for quick login.
                </p>
              </label>
              <Switch
                id='saveLoginDevices'
                checked={settings.saveLoginDevices}
                onCheckedChange={() => handleToggle('saveLoginDevices')}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='logoutFromOtherDevices'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
              >
                Logout from Other Devices
                <p className='text-xs text-muted-foreground'>
                  Automatically log out from devices after inactivity.
                </p>
              </label>
              <Switch
                id='logoutFromOtherDevices'
                checked={settings.logoutFromOtherDevices}
                onCheckedChange={() => handleToggle('logoutFromOtherDevices')}
              />
            </div>

            <div>
              <button
                onClick={togglePasswordDropdown}
                className='flex items-center justify-between w-full text-left text-sm font-medium'
              >
                Change Password
                <span>
                  {isPasswordDropdownOpen ? (
                    <ChevronUp /> // Down arrow
                  ) : (
                    <ChevronDown /> // Up arrow
                  )}
                </span>
              </button>

              {/* Animated Dropdown */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={
                  isPasswordDropdownOpen
                    ? { height: 'auto', opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <div className='mt-4 space-y-4'>
                  {/* Old Password */}
                  <div>
                    <label
                      htmlFor='old-password'
                      className='block text-sm font-medium'
                    >
                      Old Password
                    </label>
                    <input
                      type='password'
                      id='old-password'
                      placeholder='Enter old password'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor='new-password'
                      className='block text-sm font-medium'
                    >
                      New Password
                    </label>
                    <input
                      type='password'
                      id='new-password'
                      placeholder='Enter new password'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center items-center'>
          <Button className='bg-[#f5f5fa] text-[#f66659] text-md font-semibold px-4 py-4 rounded-lg border-none'>
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;
