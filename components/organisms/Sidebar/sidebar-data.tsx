// Icons
import { SidebarItems } from '@/types/sidebarTypes';

import { Category, Notepad2, UserOctagon, Home3 } from 'iconsax-react';

export const SidebarLinks: SidebarItems[] = [
  {
    title: 'dashboard',
    href: '/dashboard',
    icon: <Home3 size="21" />,
  },
  {
    title: 'users',
    href: '/users',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'levels',
    href: '/levels',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'clans',
    href: '/clans',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'avatars',
    href: '/avatars',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'weapons',
    href: '/products',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'enemy',
    href: '/enemies',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'Waves',
    href: '/waves',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'Catapult',
    href: '/catapult',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'tasks',
    href: '/tasks',
    icon: <Category size="21" />,
  },
  {
    title: 'task activity',
    href: '/task-activity',
    icon: <Notepad2 size="21" />,
  },
  {
    title: 'tap activity',
    href: '/tap-activity',
    icon: <Notepad2 size="21" />,
  },
];
