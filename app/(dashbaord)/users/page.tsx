'use client';

import React, { useState } from 'react';

// Redux
import { useAllUsersQuery } from '@/redux/slice/userSlice';

// Data
import { UserTable } from '@/data';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import UserModel from '@/components/organisms/UserModel';
import { PaginationTypes } from '@/types/commonTypes';

const page = () => {
  const [pagination, setPagination] = useState<PaginationTypes>({
    page: 1,
    limit: 10,
  });
  const {
    data: userData,
    isFetching,
    isLoading,
  } = useAllUsersQuery({
    page: pagination.page,
    limit: pagination.limit,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <UserModel open={isOpen} setOpen={setIsOpen} />

      <Heading title="Users" buttonText="Add User" buttonClick={() => setIsOpen(true)} />
      {userData && (
        <CustomTable
          columns={UserTable}
          rows={userData.data}
          pagination={pagination}
          setPagination={setPagination}
          totalCount={userData.total}
          isLoading={isFetching || isLoading}
          isEmpty={userData?.length === 0}
        />
      )}
    </>
  );
};

export default page;
