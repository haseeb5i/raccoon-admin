'use client';

import React, { useEffect } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { Level } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAddLevelMutation, useUpdateLevelMutation } from '@/redux/slice/gameSlice';

// Utils
import { showToast } from '@/utils/toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  coins: z.coerce.number(),
});
type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  coins: 1,
};

const LevelModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: Level | null;
}) => {
  const [addLevel, { isLoading: isAddLoading }] = useAddLevelMutation();
  const [editLevel, { isLoading: isEditLoading }] = useUpdateLevelMutation();

  const isLoading = isEditLoading || isAddLoading;

  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm<FormType>({ mode: 'onTouched', resolver: zodResolver(schema) });

  useEffect(() => {
    if (isEdit && editData) {
      reset(editData);
    } else {
      reset(defaultValues);
    }
  }, [editData, isEdit, setValue, reset]);

  const onSubmit = async (data: FormType) => {
    try {
      const formattedData: FormType = { ...data };
      const res: {
        data?: Level;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editLevel({ data: formattedData, id: editData?.id })
        : await addLevel(formattedData);
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Level ${isEdit ? 'updated' : 'added'} successfully`,
        });
        setOpen(false);
        reset();
      } else {
        // @ts-expect-error fix error type
        showToast({ message: res.error?.data?.message ?? '', type: 'error' });
      }
    } catch (error) {
      console.error('clan create error', error);
      showToast({ message: 'An error occurred', type: 'error' });
    }
  };

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Level`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="coins"
          control={control}
          render={({ field }) => <Input label="Coins" field={field} errors={errors} />}
        />
      </form>
    </Modal>
  );
};

export default LevelModel;
