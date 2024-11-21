'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import PostModel from '@/components/organisms/PostModel';
import CustomTable from '@/components/molecules/Table';

// Redux
import { useAllPostsQuery, useDeletePostMutation } from '@/redux/slice/postSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Data
import { PostTable } from '@/data';

// Utils
import { showToast } from '@/utils/toast';

// Types
import { PostType } from '@/types/commonTypes';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<PostType | null>(null);

  const {
    data: postData,
    isFetching,
    isLoading,
  } = useAllPostsQuery({
    search,
  });

  const [deleteData] = useDeletePostMutation();

  const onDelete = async (id: number) => {
    try {
      const res: {
        data?: { message?: string };
        error?: FetchBaseQueryError | SerializedError;
      } = await deleteData(id);

      if (res?.data) {
        showToast({
          message: 'Post deleted successfully',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onEdit = (data: PostType) => {
    setIsEdit(true);
    const filterData = postData?.filter((item: PostType) => item.id === data.id);
    setEditData(filterData[0]);
    setIsOpen(true);
  };

  return (
    <>
      <PostModel open={isOpen} setOpen={setIsOpen} isEdit={isEdit} editData={editData} />

      <Heading
        title="Posts"
        buttonText="Add Post"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        search={search}
        setSearch={setSearch}
      />

      <CustomTable
        columns={PostTable}
        rows={postData}
        isLoading={isFetching || isLoading}
        isEmpty={postData?.length === 0}
        onDelete={(data: PostType) => onDelete(data.id)}
        onEdit={(data: PostType) => onEdit(data)}
      />
    </>
  );
};

export default page;
