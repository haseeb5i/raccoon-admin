'use client';

import React, { useEffect } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { Enemy } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAddEnemyMutation, useUpdateEnemyMutation } from '@/redux/slice/gameSlice';

// Utils
import { showToast } from '@/utils/toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  baseSpeed: z.coerce.number().gt(0),
  baseXP: z.coerce.number().gt(0),
  dropArrows: z.coerce.number().gt(0),
  enemyType: z.string().min(2),
  hitPoints: z.coerce.number().gt(0),
  lateralMove: z.coerce.number().gt(0),
});
type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  baseSpeed: 0,
  baseXP: 1,
  dropArrows: 1,
  enemyType: 'Name',
  hitPoints: 1,
  lateralMove: 0,
};

const EnemyModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: Enemy | null;
}) => {
  const [addEnemy, { isLoading: isAddLoading }] = useAddEnemyMutation();
  const [editEnemy, { isLoading: isEditLoading }] = useUpdateEnemyMutation();

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
        data?: Enemy;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editEnemy({ data: formattedData, id: editData?.enemyTypeId })
        : await addEnemy(formattedData);
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Enemy ${isEdit ? 'updated' : 'added'} successfully`,
        });

        setOpen(false);
        reset();
      } else {
        // @ts-expect-error fix error type
        showToast({ message: res.error?.data?.message ?? '', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'An error occurred', type: 'error' });
      console.error('error on login', error);
    }
  };

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Enemy`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="enemyType"
            control={control}
            render={({ field }) => (
              <Input label="Enemy Name" field={field} errors={errors} />
            )}
          />

          <Controller
            name="baseSpeed"
            control={control}
            render={({ field }) => (
              <Input label="Base Speed" type="number" field={field} errors={errors} />
            )}
          />
          <Controller
            name="baseXP"
            control={control}
            render={({ field }) => (
              <Input label="Base XP" type="number" field={field} errors={errors} />
            )}
          />

          <Controller
            name="dropArrows"
            control={control}
            render={({ field }) => (
              <Input label="Drop Arrows" type="number" field={field} errors={errors} />
            )}
          />

          <Controller
            name="hitPoints"
            control={control}
            render={({ field }) => (
              <Input label="Hit Points" type="number" field={field} errors={errors} />
            )}
          />
          <Controller
            name="lateralMove"
            control={control}
            render={({ field }) => (
              <Input label="Lateral Move" type="number" field={field} errors={errors} />
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EnemyModel;
