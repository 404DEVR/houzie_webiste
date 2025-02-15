'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PropertySearch() {
  return (
    <div className='w-full max-w-7xl mx-auto px-4 space-y-4'>
      {/* Filter Section */}
      <div className='flex flex-wrap items-center gap-3'>
        <Select>
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Radius' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>1 km</SelectItem>
            <SelectItem value='2'>2 km</SelectItem>
            <SelectItem value='5'>5 km</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Property Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='apartment'>Apartment</SelectItem>
            <SelectItem value='villa'>Villa</SelectItem>
            <SelectItem value='house'>House</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Configuration' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1bhk'>1 BHK</SelectItem>
            <SelectItem value='2bhk'>2 BHK</SelectItem>
            <SelectItem value='3bhk'>3 BHK</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tabs defaultValue='account' className='w-[400px]'>
          <TabsList>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='password'>Password</TabsTrigger>
          </TabsList>
          <TabsContent value='account'>
            Make changes to your account here.
          </TabsContent>
          <TabsContent value='password'>Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
