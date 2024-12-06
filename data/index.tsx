// Icons
import { TableColumnTypes } from '@/types/commonTypes';
import { SidebarItems } from '@/types/sidebarTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

import {
  Buildings2,
  Category,
  ClipboardText,
  Crown1,
  Notepad2,
  People,
  Profile2User,
  Setting2,
  Share,
  StatusUp,
  UserOctagon,
} from 'iconsax-react';

export const SidebarLinks: SidebarItems[] = [
  {
    title: 'dashboard',
    href: '/dashboard',
    icon: <StatusUp size="21" />,
  },
  {
    title: 'users',
    href: '/users',
    icon: <People size="21" />,
  },
  {
    title: 'posts',
    href: '/posts',
    icon: <Notepad2 size="21" />,
  },
  {
    title: 'roles',
    href: '/roles',
    icon: <UserOctagon size="21" />,
  },
  {
    title: 'permissions',
    href: '/permissions',
    icon: <Setting2 size="21" />,
  },
  {
    title: 'categories',
    href: '/categories',
    icon: <Category size="21" />,
  },
  {
    title: 'products',
    href: '/products',
    icon: <Buildings2 size="21" />,
  },
  {
    title: 'orders',
    href: '/orders',
    icon: <ClipboardText size="21" />,
  },
  {
    title: 'reviews',
    href: '/reviews',
    icon: <Notepad2 size="21" />,
  },
  {
    title: 'coupons',
    href: '/coupons',
    icon: <Crown1 size="21" />,
  },
  {
    title: 'settings',
    href: '/settings',
    icon: <Share size="21" />,
  },
  {
    title: 'profile',
    href: '/profile',
    icon: <Profile2User size="21" />,
  },
];

export const UserTable: TableColumnTypes[] = [
  {
    key: 'name',
    label: 'Name',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'email',
    label: 'Email',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'action',
    label: 'Action',
    type: CUSTOM_CELL_TYPE.ACTION,
  },
];

export const PostTable: TableColumnTypes[] = [
  {
    key: 'title',
    label: 'Title',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'content',
    label: 'Content',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'action',
    label: 'Action',
    type: CUSTOM_CELL_TYPE.ACTION,
  },
];
