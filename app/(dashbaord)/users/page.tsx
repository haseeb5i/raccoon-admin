'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import UserView from './user-view';
import UserModel from './user-model';

// Redux
import { useAllUsersQuery } from '@/redux/slice/userSlice';

// Types
import {
  DateRange,
  PaginationType,
  TableColumnTypes,
  TableSortType,
  User,
} from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

type EditData = User;

const Page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [clanId, setClanId] = useState<number>(-1);
  const [search, setSearch] = useState<string>('');
  const [openView, setOpenView] = useState<boolean>(false);
  const [viewId, setViewId] = useState<string>('');
  const [editData, setEditData] = useState<EditData | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });
  const [range, setRange] = useState<DateRange | null>(null);
  const [sort, setSort] = useState<TableSortType>({ column: '' });

  const { data, isFetching, isLoading } = useAllUsersQuery({
    sorting: sort,
    dateRange: range ? `${range.start},${range.end}` : undefined,
    filters: {
      username: search || undefined,
      clanId: clanId !== -1 ? clanId : undefined,
    },
    page: pagination.page,
    limit: pagination.limit,
  });

  const usersData = data?.data ?? [];

  const onEdit = (data: EditData) => {
    const filterData = usersData?.filter(item => item.tgId === data.tgId);
    // @ts-expect-error don't need complete type
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  const onView = (id: string) => {
    setViewId(id);
    setOpenView(true);
  };

  return (
    <>
      <UserModel open={isOpen} setOpen={setIsOpen} editData={editData} />
      <UserView open={openView} setOpen={setOpenView} viewId={viewId} />

      <Heading
        title="Users"
        search={search}
        setSearch={setSearch}
        clanId={clanId}
        setClanId={setClanId}
        dateRange={range}
        setDateRange={setRange}
      />

      <CustomTable
        columns={ActivityTable}
        rows={usersData}
        isLoading={isFetching || isLoading}
        isEmpty={usersData?.length === 0}
        pagination={pagination}
        setPagination={setPagination}
        sort={sort}
        setSort={setSort}
        totalCount={data?.total}
        onView={(data: EditData) => onView(data.tgId)}
        onEdit={(data: EditData) => onEdit(data)}
      />
    </>
  );
};

const ActivityTable: TableColumnTypes[] = [
  {
    key: 'key',
    label: '#ID',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'username',
    label: 'Username',
    type: CUSTOM_CELL_TYPE.TEXT,
    canSort: true,
  },
  {
    key: 'clanName',
    label: 'Clan',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'level',
    label: 'Level',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'currentCoins',
    label: 'Current Coins',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'totalCoins',
    label: 'Total Coins',
    type: CUSTOM_CELL_TYPE.TEXT,
    canSort: true,
  },
  {
    key: 'fuelCapacity',
    label: 'Total Arrows',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'isActive',
    label: 'Active',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'createdAt',
    label: 'Created At',
    type: CUSTOM_CELL_TYPE.DATE,
  },
  {
    key: 'updatedAt',
    label: 'Updated At',
    type: CUSTOM_CELL_TYPE.DATE,
  },
  {
    key: 'action',
    label: 'Action',
    type: CUSTOM_CELL_TYPE.ACTION,
  },
];

export default Page;
