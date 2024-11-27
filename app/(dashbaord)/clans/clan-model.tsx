'use client';

import React, { useEffect } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { Clan } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAddClanMutation, useUpdateClanMutation } from '@/redux/slice/clanSlice';

// Utils
import { showToast } from '@/utils/toast';
import { minErrorMsg, requiredErrorMsg } from '@/utils/helper';
import FileUpload from '@/components/FileUpload';

type FormType = Omit<Clan, 'clanId' | 'createdAt' | 'updatedAt'>;

const defaultValues: FormType = {
  chainId: 1,
  mascotUrl: '',
  tokenAddr: '',
  name: '',
  tokenLogo: '',
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
  editData?: Clan | null;
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
  } = useForm<FormType>({ mode: 'onTouched' });

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
        data?: Clan;
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
      console.log(data, formattedData);
    } catch (error) {
      showToast({ message: 'An error occurred', type: 'error' });
      console.error('error on login', error);
    } finally {
      // setOpen(false);
      // reset();
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
            rules={{
              required: requiredErrorMsg('Clan Name'),
            }}
            control={control}
            render={({ field }) => (
              <Input label="Clan Name" field={field} errors={errors} />
            )}
          />

          <Controller
            name="chainId"
            rules={{
              required: requiredErrorMsg('Chain ID'),
              min: { value: 0, message: minErrorMsg('Chain ID', 0) },
            }}
            control={control}
            render={({ field }) => (
              <Input label="Chain ID" type="number" field={field} errors={errors} />
            )}
          />
          <Controller
            name="tokenAddr"
            rules={{
              required: requiredErrorMsg('Token Addr'),
            }}
            control={control}
            render={({ field }) => (
              <Input label="Token Addr" field={field} errors={errors} />
            )}
          />
        </div>

        <Controller
          name="tokenLogo"
          rules={{
            required: requiredErrorMsg('Clan Icon'),
          }}
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              onError={message => showToast({ message, type: 'error' })}
            />
          )}
        />

        <Controller
          name="mascotUrl"
          rules={{
            required: requiredErrorMsg('Clan Mascot'),
          }}
          control={control}
          render={({ field }) => (
            <FileUpload
              {...field}
              onError={message => showToast({ message, type: 'error' })}
            />
          )}
        />
      </form>
    </Modal>
  );
};

export default ClanModel;
