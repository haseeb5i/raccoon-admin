'use client';

import React, { useEffect } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { Catapult } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useUpdateCatapultMutation } from '@/redux/slice/gameSlice';

// Utils
import { showToast } from '@/utils/toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  // name: z.string().min(3),
  baseDamage: z.coerce.number().gt(0),
  areaRadius: z.coerce.number().gt(0),
  waveCooldown: z.coerce.number().gt(0),
  // damageMulti: z.coerce.number().gt(0),
});
type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  areaRadius: 1,
  baseDamage: 1,
  waveCooldown: 1,
};

const CatapultModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: Catapult | null;
}) => {
  // const [addCatapult, { isLoading: isAddLoading }] = useAddCatapultMutation();
  const [editCatapult, { isLoading: isEditLoading }] = useUpdateCatapultMutation();

  const isLoading = isEditLoading;

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
    if (!isEdit) {
      console.log(data);
      return;
    }

    try {
      const formattedData: FormType = { ...data };
      const res: {
        data?: Catapult;
        error?: FetchBaseQueryError | SerializedError;
      } = await editCatapult({ data: formattedData, id: editData?.id });
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Catapult ${isEdit ? 'updated' : 'added'} successfully`,
        });
        setOpen(false);
        reset();
      } else {
        // @ts-expect-error fix error type
        showToast({ message: res.error?.data?.message ?? '', type: 'error' });
      }
    } catch (error) {
      console.error('catapult create error', error);
      showToast({ message: 'An error occurred', type: 'error' });
    }
  };

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Catapult`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="baseDamage"
            control={control}
            render={({ field }) => (
              <Input label="Base Damage" type="number" field={field} errors={errors} />
            )}
          />

          <Controller
            name="areaRadius"
            control={control}
            render={({ field }) => (
              <Input label="Area Radius" type="number" field={field} errors={errors} />
            )}
          />

          <Controller
            name="waveCooldown"
            control={control}
            render={({ field }) => (
              <Input label="Wave Interval" type="number" field={field} errors={errors} />
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CatapultModel;
