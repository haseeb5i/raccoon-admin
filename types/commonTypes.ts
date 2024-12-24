/* eslint-disable @typescript-eslint/no-explicit-any */
import { BADGE_VARIANTS, CUSTOM_CELL_TYPE } from '@/utils/enums';
import { dropDownMenus } from './dropDownTypes';
import { Dispatch, SetStateAction } from 'react';
import { DateValue, SortDescriptor } from '@nextui-org/react';

export interface BreadCrumbsProps {
  title: string;
  link: string;
}

export type PaginationType = {
  page: number;
  limit: number;
};

export type SelectedRowsType = Set<string> | 'all';
export type DateRange = {
  start: DateValue;
  end: DateValue;
};

export type TableRowTypes = {
  key: string | number;
  [key: string]: string | number | boolean | null;
};

export interface CustomTableProps {
  selectionMode?: 'none' | 'multiple';
  columns: TableColumnTypes[];
  rows: TableRowTypes[];
  showPagination?: boolean;
  isLoading?: boolean;
  onRowClick?: (_row: { [key: string]: string }) => void;
  customActionMenu?: dropDownMenus[];
  onDelete?: (_data: any) => void;
  onView?: (_data: any) => void;
  onEdit?: (_data: any) => void;
  TrashIcon?: boolean;
  showActionDropdown?: boolean;
  isEmpty?: boolean;
  totalCount?: number;
  pagination?: PaginationType;
  setPagination?: Dispatch<SetStateAction<PaginationType>>;
  selectedRows?: SelectedRowsType;
  setSelectedRows?: (_data: any) => void;
  conditionalType?: string;
  sort?: TableSortType;
  setSort?: Dispatch<SetStateAction<TableSortType>>;
}

export type TableColumnTypes = {
  key: string;
  label: string;
  type: CUSTOM_CELL_TYPE;
  canSort?: boolean;
  align?: 'left' | 'center' | 'right';
  subItem?: TableColumnTypes;
};

export type TableSortType = SortDescriptor;

export interface TableCellProps {
  type: CUSTOM_CELL_TYPE;
  variant?: BADGE_VARIANTS;
  subtext?: string;
}

export type ActionDropdownProps = {
  onView?: (_data: any) => void;
  onEdit?: (_data: any) => void;
  onDelete?: (_data: any) => void;
  customActionMenu?: dropDownMenus[];
  TrashIcon?: boolean;
  showActionDropdown?: boolean;
  data: any;
  rowkey?: string;
  align?: 'left' | 'center' | 'right';
  conditionalType?: string;
};

export interface CustomTableCellProps extends TableCellProps, ActionDropdownProps {}

export type FindAllParams = PaginationType & {
  dateRange?: string;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
};

export type User = {
  tgId: string;
  username: string;
  referralCode: string;
  currentPoints: number;
  totalPoints: number;
  fuelCapacity: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  level: { userLevel: number };
  clan: { name: string };
};

// TODO: handle boolean at table level
export type UserWithKey = Omit<User, 'clan' | 'level'> & {
  key: string;
  isActive: string;
  clanName: string;
  level: number;
};

type UserItem = {
  userItemId: number;
  level: number;
  remaining: number;
  favorite: boolean;
  itemId: number;
  tgId: string;
  createdAt: string;
  updatedAt: string;
  storeItem: StoreItem;
};

type StoreItem = {
  itemId: number;
  name: string;
  baseCost: number;
  description: string | null;
  maxLevel: number;
  imageUrl: string;
  type: string;
  deleted: boolean;
};

export type UserProfile = User & {
  items: UserItem[];
  avatar: {
    requiredLevel: number;
    imageUrl: string;
    variantId: number;
  };
  userLevel: number;
  totalReferrals: number;
  lastWeekRefs: number;
  lastMonthRefs: number;
};

export type Task = {
  taskId: number;
  iconUrl: string;
  title: string;
  link?: string;
  type: number;
  rewardCoins: number;
  repeatable: boolean;
  createdAt: string;
  updatedAt: string;
  streakRewards: Array<{
    dayCount: number;
    rewardCoins: number;
  }>;
  tweetId?: string; // for xReply and xRetweet
  targetUsername?: string; // for xFollow
  targetChannel?: string; // for youtube follow
  metadata: Record<string, string>;
  expiresAt: string | null;
};

export type TaskWithKey = Task & {
  key: number;
  canRepeat: string;
  taskLink: string;
};

export type TaskActivity = {
  taskActivityId: number;
  tgId: string;
  taskId: number;
  task: {
    type: number;
    title: string;
  };
  user: { username: string };
  createdAt: string;
  updatedAt: string;
};

export type TaskActivityWithKey = {
  key: number;
  taskTitle: string;
  taskUser: string;
  createdAt: string;
  updatedAt: string;
};

export type TapActivity = {
  tapActivityId: number;
  tgId: string;
  user: { username: string };
  points: number;
  fuel: number;
  createdAt: string;
  updatedAt: string;
};

export type TapActivityWithKey = Omit<TapActivity, 'user'> & {
  key: number;
  tapUser: string;
};

export type Clan = {
  clanId: number;
  name: string;
  chainId: number;
  tokenAddr: string;
  tokenLogo: string;
  mascotUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ClanWithKey = Clan & { key: number };

export type Enemy = {
  enemyTypeId: number;
  enemyType: string;
  baseSpeed: number;
  hitPoints: number;
  baseXP: number;
  lateralMove: number;
  dropArrowsCount: number;
  dropArrowsPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type EnemyWithKey = Enemy & {
  key: number;
};

export type Wave = {
  waveId: number;
  index: number;
  arrowsForWave: number;
  spawnRate: number;
  speedMultiplier: number;
  arrowDropMultiplier: number;
  createdAt: string;
  updatedAt: string;
  enemiesPerType: {
    count: number;
    enemyTypeId: number;
  }[];
};

export type WaveWithKey = Wave & {
  key: number;
};

type AvatarVariant = {
  variantId: number;
  requiredLevel: number;
  imageUrl: string;
  avatarId: number;
  createdAt: string;
  updatedAt: string;
};

export type Avatar = {
  avatarId: number;
  clanId: number;
  name?: string;
  createdAt: string;
  maxLevel: number;
  updatedAt: string;
  clan: { name: string };
  variants: AvatarVariant[];
};

export type AvatarWithKey = Avatar & {
  key: number;
  clanName: string;
};

export type Level = {
  id: number;
  level: number;
  coins: number;
  createdAt: string;
  updatedAt: string;
};

export type LevelWithKey = Level & {
  key: number;
};

export type ItemType = 'Arrow' | 'Bow' | 'PowerUp';

export type Product = {
  itemId: number;
  name: string;
  baseCost: number;
  maxLevel: number;
  imageUrl: string;
  type: ItemType;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  soldCount: number;
  arrow?: any;
  bow?: any;
};

export type ProductWithKey = Product & {
  key: number;
  damage: string;
  multiplier: string;
};
