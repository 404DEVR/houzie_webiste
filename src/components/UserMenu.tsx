'use client';

import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { UserMenuProps } from '@/interfaces/PropsInterface';

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.email
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const name = user.email.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={user.image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/profile' className='cursor-pointer'>
            <User className='mr-2 h-4 w-4' />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className='cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
