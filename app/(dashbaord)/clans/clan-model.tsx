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
import FileUpload from '@/components/FileUpload';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@/components/ErrorMessage';

const schema = z.object({
  name: z.string().min(3),
  chainId: z.coerce.number(),
  tokenAddr: z.string(),
  mascotUrl: z.string().url(),
  tokenLogo: z.string().url(),
});
type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  chainId: 1,
  tokenAddr: '0x0',
  name: '',
  mascotUrl: '',
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

  console.log(errors);

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
            render={({ field }) => (
              <Input label="Clan Name" field={field} errors={errors} />
            )}
          />

          <Controller
            name="tokenLogo"
            control={control}
            render={({ field }) => (
              <div>
                <p className="text-sm text-foreground">Upload Logo (same width and height)</p>
                <FileUpload
                  {...field}
                  onError={message => showToast({ message, type: 'error' })}
                />
                <ErrorMessage errorMsg={errors.tokenLogo?.message} />
              </div>
            )}
          />
          <Controller
            name="mascotUrl"
            control={control}
            render={({ field }) => (
              <div className="mt-3">
                <p className="text-sm text-foreground">Upload Mascot (w: 455px x h: 530px)</p>
                <FileUpload
                  {...field}
                  onError={message => showToast({ message, type: 'error' })}
                />
                <ErrorMessage errorMsg={errors.mascotUrl?.message} />
              </div>
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ClanModel;
