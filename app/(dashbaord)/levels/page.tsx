'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import LevelModel from './level-model';

// Redux
import { useAllLevelsQuery, useDeleteLevelMutation } from '@/redux/slice/gameSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { showToast } from '@/utils/toast';

// Types
import { Level, PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Level | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
  });

  const { data, isFetching, isLoading } = useAllLevelsQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const levelsData = data?.data ?? [];

  const [deleteData] = useDeleteLevelMutation();

  const onDelete = async (id: number) => {
    try {
      const res: {
        data?: { message?: string };
        error?: FetchBaseQueryError | SerializedError;
      } = await deleteData(id);

      if (res?.data) {
        showToast({
          type: 'success',
          message: 'Level deleted successfully',
        });
      } else {
        // @ts-expect-error fix error type
        showToast({ message: res.error?.data?.message ?? '', type: 'error' });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onEdit = (data: Level) => {
    setIsEdit(true);
    const filterData = levelsData?.filter(item => item.id === data.id);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <LevelModel open={isOpen} setOpen={setIsOpen} isEdit={isEdit} editData={editData} />

      <Heading
        title="Levels"
        buttonText="Add Level"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        search={search}
        setSearch={setSearch}
      />

      <CustomTable
        columns={LevelTable}
        rows={levelsData!}
        isLoading={isFetching || isLoading}
        isEmpty={levelsData?.length === 0}
        onDelete={(data: Level) => onDelete(data.id)}
        onEdit={(data: Level) => onEdit(data)}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
      />
    </>
  );
};

const LevelTable: TableColumnTypes[] = [
  {
    key: 'level',
    label: 'Level',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'coins',
    label: 'Coins',
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

export default page;
