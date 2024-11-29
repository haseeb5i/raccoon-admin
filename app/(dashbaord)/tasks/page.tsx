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
import { Task, PaginationType, TableColumnTypes, TaskWithKey } from '@/types/commonTypes';
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

  type WithoutComposite = Omit<TaskWithKey, 'streakRewards' | 'metadata'>;
  const tasksData = (data?.data ?? []) as WithoutComposite[];

  const [deleteData] = useDeleteTaskMutation();

  const onDelete = async (id: number) => {
    try {
      const res: {
        data?: { message?: string };
        error?: FetchBaseQueryError | SerializedError;
      } = await deleteData(id);

      if (res?.data) {
        showToast({ type: 'success', message: 'Task deleted successfully' });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onEdit = (taskData: Task) => {
    setIsEdit(true);
    const filterData = data?.data?.filter(item => item.taskId === taskData.taskId);
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
        rows={tasksData}
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
