'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';

// Redux
import { useAllTaskActivityQuery } from '@/redux/slice/activitySlice';

// Types
import { PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const Page = () => {
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllTaskActivityQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const activityData = data?.data;
  const isEmpty = !activityData || activityData.length === 0;

  return (
    <>
      <Heading title="Task Activity" />

      <CustomTable
        columns={ActivityTable}
        rows={activityData!}
        isLoading={isFetching || isLoading}
        isEmpty={isEmpty}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
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
    key: 'taskUser',
    label: 'Username',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'taskTitle',
    label: 'Task Name',
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
];

export default Page;
