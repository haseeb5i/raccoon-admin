'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import CatapultModel from './catapult-model';

// Redux
import { useAllCatapultsQuery } from '@/redux/slice/gameSlice';

// Types
import { Catapult, PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Catapult | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllCatapultsQuery({});

  const catapultsData = data?.data;

  const onEdit = (data: Catapult) => {
    setIsEdit(true);
    const filterData = catapultsData?.filter(item => item.id === data.id);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <CatapultModel
        open={isOpen}
        setOpen={setIsOpen}
        isEdit={isEdit}
        editData={editData}
      />

      <Heading
        title="Catapult"
        // buttonText="Add Catapult"
        // buttonClick={() => {
        //   setIsEdit(false);
        //   setEditData(null);
        //   setIsOpen(true);
        // }}
      />

      <CustomTable
        columns={ClanTable}
        rows={catapultsData!}
        isLoading={isFetching || isLoading}
        isEmpty={catapultsData?.length === 0}
        // onDelete={(data: Catapult) => onDelete(data.clanId)}
        onEdit={(data: Catapult) => onEdit(data)}
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
    key: 'baseDamage',
    label: 'Damage',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'areaRadius',
    label: 'radius',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'waveCooldown',
    label: 'Wave Interval',
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
