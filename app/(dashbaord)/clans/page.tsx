'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import ClanModel from './clan-model';

// Redux
import { useAllClansQuery, useDeleteClanMutation } from '@/redux/slice/clanSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { showToast } from '@/utils/toast';

// Types
import { Clan, PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Clan | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllClansQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const clansData = data?.data;

  const [deleteData] = useDeleteClanMutation();

  const onDelete = async (id: number) => {
    try {
      const res: {
        data?: { message?: string };
        error?: FetchBaseQueryError | SerializedError;
      } = await deleteData(id);

      if (res?.data) {
        showToast({
          message: 'Clan deleted successfully',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onEdit = (data: Clan) => {
    setIsEdit(true);
    const filterData = clansData?.filter(item => item.clanId === data.clanId);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <ClanModel open={isOpen} setOpen={setIsOpen} isEdit={isEdit} editData={editData} />

      <Heading
        title="Clans"
        buttonText="Add Clan"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        search={search}
        setSearch={setSearch}
      />

      <CustomTable
        columns={ClanTable}
        rows={clansData!}
        isLoading={isFetching || isLoading}
        isEmpty={clansData?.length === 0}
        onDelete={(data: Clan) => onDelete(data.clanId)}
        onEdit={(data: Clan) => onEdit(data)}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
      />
    </>
  );
};

const ClanTable: TableColumnTypes[] = [
  {
    key: 'name',
    label: 'Name',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'tokenLogo',
    label: 'Icon',
    type: CUSTOM_CELL_TYPE.IMAGE,
  },
  {
    key: 'mascotUrl',
    label: 'Mascot',
    type: CUSTOM_CELL_TYPE.IMAGE,
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

export default page;
