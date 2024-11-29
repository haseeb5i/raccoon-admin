'use client';

import React, { useEffect } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { Avatar } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAddClanMutation, useUpdateClanMutation } from '@/redux/slice/clanSlice';

// Utils
import { showToast } from '@/utils/toast';
// import FileUpload from '@/components/FileUpload';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().optional(),
  clanId: z.number(),
});
type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  clanId: 1,
};

const ClanModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: Avatar | null;
}) => {
  const [addClan, { isLoading: isAddLoading }] = useAddClanMutation();
  const [editClan, { isLoading: isEditLoading }] = useUpdateClanMutation();

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
        data?: Avatar;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editClan({ data: formattedData, id: editData?.clanId })
        : await addClan(formattedData);
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Clan ${isEdit ? 'updated' : 'added'} successfully`,
        });
      }
    } catch (error) {
      showToast({ message: 'An error occurred', type: 'error' });
      console.error('error on login', error);
    } finally {
      setOpen(false);
      reset();
    }
  };

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Clan`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input label="Name" field={field} errors={errors} />}
          />
          {/* <Controller
          name="mascotUrl"
          rules={{
            required: requiredErrorMsg('Clan Mascot'),
          }}
          control={control}
          render={({ field }) => (
            <div className="mt-3">
              <p className="text-sm text-foreground">Upload Mascot</p>
              <FileUpload
                {...field}
                onError={message => showToast({ message, type: 'error' })}
              />
            </div>
          )}
        /> */}
        </div>
      </form>
    </Modal>
  );
};

export default ClanModel;
