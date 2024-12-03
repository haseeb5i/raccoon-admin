'use client';

import React, { useEffect } from 'react';

// use hook form
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
} from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { Avatar } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAllClansQuery } from '@/redux/slice/clanSlice';
import { useAddAvatarMutation, useUpdateAvatarMutation } from '@/redux/slice/avatarSlice';

// Utils
import { showToast } from '@/utils/toast';
// import FileUpload from '@/components/FileUpload';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { MdAddCircleOutline, MdClear as MdClearIcon } from 'react-icons/md';

const schema = z.object({
  name: z.string().optional(),
  clanId: z.number().gte(0),
  variantsData: z.array(
    z.object({
      requiredLevel: z.coerce.number().gte(0),
      imageUrl: z.string().url(),
    })
  ),
});
type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  clanId: 1,
  variantsData: [{ requiredLevel: 0, imageUrl: '' }],
};

const AvatarModel = ({
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
  const { data, isLoading: dataLoading } = useAllClansQuery({ page: 1, limit: 20 });
  const [addAvatar, { isLoading: isAddLoading }] = useAddAvatarMutation();
  const [editAvatar, { isLoading: isEditLoading }] = useUpdateAvatarMutation();

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
      reset({ ...editData, variantsData: editData.variants });
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
        ? await editAvatar({ data: formattedData, id: editData?.clanId })
        : await addAvatar(formattedData);
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Avatar ${isEdit ? 'updated' : 'added'} successfully`,
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
      title={`${isEdit ? 'Edit' : 'Add'} Avatar`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
      primaryButtonLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input label="Name" field={field} errors={errors} />}
          />

          <Controller
            name="clanId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={undefined}
                size="sm"
                variant="bordered"
                color="primary"
                isLoading={dataLoading}
                items={data?.data ?? []}
                classNames={{
                  base: 'max-w-xs',
                  label: 'text-default-400 text-xs',
                  trigger: 'sm:h-[41px] min-h-[41px] h-[41px] border',
                  value: 'text-foreground sm:text-xs text-xs',
                }}
                selectedKeys={[String(field.value)]}
                onSelectionChange={data => {
                  if (!data.currentKey) return;
                  field.onChange(parseInt(data.currentKey));
                }}
                label="Select Clan"
                isInvalid={Boolean(errors.clanId?.message)}
                errorMessage={errors.clanId?.message}
              >
                {item => <SelectItem key={item.clanId}>{item.name}</SelectItem>}
              </Select>
            )}
          />

          <AddAvatarVariants control={control} errors={errors} />
        </div>
      </form>
    </Modal>
  );
};

type AddAvatarVariantsProps = {
  control: Control<FormType, unknown>;
  errors: FieldErrors<FormType>;
};

const AddAvatarVariants = ({ control, errors }: AddAvatarVariantsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variantsData',
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm">Add Variants</span>
        <Button
          isIconOnly
          onClick={() => append({ requiredLevel: fields.length, imageUrl: '' })}
        >
          <MdAddCircleOutline />
        </Button>
      </div>

      {fields.map((field, index) => (
        <div className="flex items-start gap-4" key={field.id}>
          <Controller
            name={`variantsData.${index}.requiredLevel`}
            control={control}
            render={({ field }) => <Input label="Level" readOnly field={field} />}
          />

          <Controller
            name={`variantsData.${index}.imageUrl`}
            control={control}
            render={({ field }) => <Input label="Image" field={field} errors={errors} />}
          />
          <Button onClick={() => remove(index)}>
            <MdClearIcon />
          </Button>
        </div>
      ))}
    </>
  );
};

export default AvatarModel;
