/* eslint-disable @typescript-eslint/no-explicit-any */
import { BADGE_VARIANTS, CUSTOM_CELL_TYPE } from '@/utils/enums';
import { dropDownMenus } from './dropDownTypes';
import { Dispatch, SetStateAction } from 'react';

export interface BreadCrumbsProps {
  title: string;
  link: string;
}

export type PaginationType = {
  page: number;
  limit: number;
};

export type SelectedRowsType = Set<string> | 'all';

export type TableRowTypes = {
  key: string | number;
  [key: string]: string | number | boolean;
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
}

export type TableColumnTypes = {
  key: string;
  label: string;
  type: CUSTOM_CELL_TYPE;
  align?: 'left' | 'center' | 'right';
  subItem?: TableColumnTypes;
};

export type TableSortTypes = {
  field: string | '';
  type: CUSTOM_CELL_TYPE.TEXT | CUSTOM_CELL_TYPE.DATE | '';
  count: number;
};

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

export interface PostType {
  title: string;
  content: string;
  id: number;
}

export type FindAllParams = PaginationType & {};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
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
};

// TODO: handle boolean at table level
export type UserWithKey = User & {
  key: string;
  isActive: string;
};

export type Task = {
  taskId: number;
  iconUrl: string;
  taskTitle: string;
  taskLink?: string;
  taskType: number;
  rewardPoints: number;
  repeatable: boolean;
  createdAt: string;
  updatedAt: string;
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
