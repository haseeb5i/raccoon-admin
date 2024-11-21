/* eslint-disable @typescript-eslint/no-explicit-any */
import { BADGE_VARIANTS } from '@/utils/enums';
import { dropDownMenus } from './dropDownTypes';
import { Dispatch, SetStateAction } from 'react';

export interface BreadCrumbsProps {
  title: string;
  link: string;
}

export enum CUSTOM_CELL_TYPE {
  TEXT = 'TEXT',
  TEXTWITHSUBTEXT = 'TEXTWITHSUBTEXT',
  BADGE = 'BADGE',
  LINK = 'LINK',
  ACTION = 'ACTION',
  DATE = 'DATE',
  EYE = 'EYE',
  DESCRIPTOR = 'DESCRIPTOR',
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export type PaginationTypes = {
  page: number;
  limit: number;
};

export type SelectedRowsType = Set<string> | 'all';

export type TableRowTypes = {
  key: string;
  [key: string]: string;
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
  pagination?: PaginationTypes;
  setPagination?: Dispatch<SetStateAction<PaginationTypes>>;
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
