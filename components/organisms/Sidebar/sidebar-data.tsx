// Icons
import { SidebarItems } from '@/types/sidebarTypes';

import { Category, Notepad2, StatusUp, UserOctagon } from 'iconsax-react';

export const SidebarLinks: SidebarItems[] = [
  {
    title: 'dashboard',
    href: '/dashboard',
    icon: <StatusUp size="21" />,
  },
  {
    title: 'users',
    href: '/users',
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
