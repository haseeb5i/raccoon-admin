'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import AvatarModel from './avatar-model';

// Redux
import { useAllAvatarsQuery, useDeleteAvatarMutation } from '@/redux/slice/avatarSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { showToast } from '@/utils/toast';

// Types
import {
  Avatar,
  AvatarWithKey,
  PaginationType,
  TableColumnTypes,
} from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [clanId, setClanId] = useState<number>(-1);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Avatar | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllAvatarsQuery({
    clanId: clanId !== -1 ? clanId : undefined,
    page: pagination.page,
    limit: pagination.limit,
  });

  type WithoutComposite = Omit<AvatarWithKey, 'clan' | 'variants'>;
  const avatarsData = (data?.data ?? []) as WithoutComposite[];

  const [deleteData] = useDeleteAvatarMutation();

  const onDelete = async (id: number) => {
    try {
      const res: {
        data?: { message?: string };
        error?: FetchBaseQueryError | SerializedError;
      } = await deleteData(id);

      if (res?.data) {
        showToast({
          type: 'success',
          message: 'Avatar deleted successfully',
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onEdit = (avatar: Avatar) => {
    setIsEdit(true);
    const filterData = data?.data?.filter(item => item.avatarId === avatar.avatarId);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <AvatarModel
        open={isOpen}
        setOpen={setIsOpen}
        isEdit={isEdit}
        editData={editData}
      />

      <Heading
        title="Avatars"
        buttonText="Add Avatar"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        clanId={clanId}
        setClanId={setClanId}
      />

      <CustomTable
        columns={AvatarTable}
        rows={avatarsData}
        isLoading={isFetching || isLoading}
        isEmpty={avatarsData?.length === 0}
        onDelete={(data: Avatar) => onDelete(data.avatarId)}
        onEdit={(data: Avatar) => onEdit(data)}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
      />
    </>
  );
};

const AvatarTable: TableColumnTypes[] = [
  {
    key: 'name',
    label: 'Avatar',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'clanName',
    label: 'Clan',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'maxLevel',
    label: 'Max Level',
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
