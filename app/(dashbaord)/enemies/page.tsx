'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import EnemyModel from './enemy-model';

// Redux
import { useAllEnemiesQuery } from '@/redux/slice/gameSlice';
// import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
// import { SerializedError } from '@reduxjs/toolkit';

// Utils
// import { showToast } from '@/utils/toast';

// Types
import { Enemy, PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Enemy | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllEnemiesQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const clansData = data?.data ?? [];

  // const [deleteData] = useDeleteEnemyMutation();

  // const onDelete = async (id: number) => {
  //   try {
  //     const res: {
  //       data?: { message?: string };
  //       error?: FetchBaseQueryError | SerializedError;
  //     } = await deleteData(id);

  //     if (res?.data) {
  //       showToast({
  //         message: 'Enemy deleted successfully',
  //         type: 'success',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('error', error);
  //   }
  // };

  const onEdit = (data: Enemy) => {
    setIsEdit(true);
    const filterData = clansData?.filter(item => item.enemyTypeId === data.enemyTypeId);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <EnemyModel open={isOpen} setOpen={setIsOpen} isEdit={isEdit} editData={editData} />

      <Heading
        title="Enemys"
        buttonText="Add Enemy"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        search={search}
        setSearch={setSearch}
      />

      <CustomTable
        columns={EnemyTable}
        rows={clansData}
        isLoading={isFetching || isLoading}
        isEmpty={clansData?.length === 0}
        // onDelete={(data: Enemy) => onDelete(data.clanId)}
        onEdit={(data: Enemy) => onEdit(data)}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
      />
    </>
  );
};

const EnemyTable: TableColumnTypes[] = [
  {
    key: 'enemyType',
    label: 'Name',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'baseSpeed',
    label: 'B. Speed',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'hitPoints',
    label: 'Health',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'baseXP',
    label: 'Base XP',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'dropArrows',
    label: 'Drop Arrows',
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
