'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import TaskModel from './task-model';

// Redux
import { useAllTasksQuery, useDeleteTaskMutation } from '@/redux/slice/taskSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { showToast } from '@/utils/toast';

// Types
import { Task, PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Task | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllTasksQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const tasksData = data?.data;

  const [deleteData] = useDeleteTaskMutation();

  const onDelete = async (id: number) => {
    try {
      const res: {
        data?: { message?: string };
        error?: FetchBaseQueryError | SerializedError;
      } = await deleteData(id);

      if (res?.data) {
        showToast({
          message: 'Task deleted successfully',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onEdit = (data: Task) => {
    setIsEdit(true);
    const filterData = tasksData?.filter(item => item.taskId === data.taskId);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <TaskModel open={isOpen} setOpen={setIsOpen} isEdit={isEdit} editData={editData} />

      <Heading
        title="Tasks"
        buttonText="Add Task"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        search={search}
        setSearch={setSearch}
      />

      <CustomTable
        columns={TaskTable}
        rows={tasksData!}
        isLoading={isFetching || isLoading}
        isEmpty={tasksData?.length === 0}
        onDelete={(data: Task) => onDelete(data.taskId)}
        onEdit={(data: Task) => onEdit(data)}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
      />
    </>
  );
};

const TaskTable: TableColumnTypes[] = [
  {
    key: 'title',
    label: 'Title',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'iconUrl',
    label: 'Icon',
    type: CUSTOM_CELL_TYPE.IMAGE,
  },
  {
    key: 'typeLabel',
    label: 'Type',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'rewardCoins',
    label: 'Reward Points',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'canRepeat',
    label: 'Repeatable',
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
