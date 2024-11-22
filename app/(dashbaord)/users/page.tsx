'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import UserModel from './user-model';

// Redux
import { useAllUsersQuery } from '@/redux/slice/userSlice';

// Types
import { PaginationType, TableColumnTypes, User } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

type EditData = User;

const Page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllUsersQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const usersData = data?.data;

  const onEdit = (data: EditData) => {
    const filterData = usersData?.filter(item => item.tgId === data.tgId);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <UserModel open={isOpen} setOpen={setIsOpen} editData={editData} />

      <Heading title="Users" />

      <CustomTable
        columns={ActivityTable}
        rows={usersData!}
        isLoading={isFetching || isLoading}
        isEmpty={usersData?.length === 0}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
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
  },
  {
    key: 'fuelCapacity',
    label: 'Fuel Cap',
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
