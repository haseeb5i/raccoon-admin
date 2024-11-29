'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import WaveModel from './wave-model';

// Redux
import { useAllWavesQuery } from '@/redux/slice/gameSlice';

// Types
import { Wave, PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Wave | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
  });

  const { data, isFetching, isLoading } = useAllWavesQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const wavesData = data?.data ?? [];

  const onEdit = (data: Wave) => {
    setIsEdit(true);
    const filterData = wavesData?.filter(item => item.waveId === data.waveId);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <WaveModel open={isOpen} setOpen={setIsOpen} isEdit={isEdit} editData={editData} />

      <Heading
        title="Waves"
        buttonText="Add Wave"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        search={search}
        setSearch={setSearch}
      />

      <CustomTable
        columns={WaveTable}
        rows={wavesData}
        isLoading={isFetching || isLoading}
        isEmpty={wavesData?.length === 0}
        // onDelete={(data: Wave) => onDelete(data.waveId)}
        onEdit={(data: Wave) => onEdit(data)}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
      />
    </>
  );
};

const WaveTable: TableColumnTypes[] = [
  {
    key: 'index',
    label: 'Wave Idx',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'arrowsForWave',
    label: 'Arrows',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'arrowDropMultiplier',
    label: 'Arrow Drop Mult',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'spawnRate',
    label: 'Spawn Rate',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'speedMultiplier',
    label: 'Speed Mult',
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
