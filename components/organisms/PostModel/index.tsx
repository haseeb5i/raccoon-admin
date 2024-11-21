'use client';

import React, { useEffect } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';
import TextArea from '@/components/atoms/TextArea';

// Types
import { PostType } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAddPostMutation, useUpdatePostMutation } from '@/redux/slice/postSlice';

// Utils
import { showToast } from '@/utils/toast';

const PostModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: PostType | null;
}) => {
  const [addPost, { isLoading: isAddLoading }] = useAddPostMutation();
  const [editPost, { isLoading: isEditLoading }] = useUpdatePostMutation();

  const isLoading = isEditLoading || isAddLoading;

  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm<PostType>({
    mode: 'onTouched',
  });

  useEffect(() => {
    if (isEdit && editData) {
      setValue('title', editData.title);
      setValue('content', editData.content);
    }
  }, [editData, isEdit]);

  const onSubmit = async (data: PostType) => {
    try {
      const res: {
        data?: PostType;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editPost({
            data,
            id: editData?.id,
          })
        : await addPost(data);

      if (res?.data) {
        showToast({
          message: `Post ${isEdit ? 'Update' : 'Add'} successfully`,
          type: 'success',
        });
      }
    } catch (error) {
      showToast({
        message: 'An error occurred',
        type: 'error',
      });
      console.error('error on login', error);
    } finally {
      setOpen(false);
      reset();
      setValue('title', '');
      setValue('content', '');
    }
  };

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Post`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={() => {
        handleSubmit(onSubmit)();
      }}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="title"
            rules={{ required: 'Title is required' }}
            control={control}
            render={({ field }) => (
              <Input label="Title" name="Title" field={field} errors={errors} />
            )}
          />

          <Controller
            name="content"
            rules={{ required: 'Content is required' }}
            control={control}
            render={({ field }) => (
              <TextArea label="Content" name="Content" field={field} errors={errors} />
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

export default PostModel;
