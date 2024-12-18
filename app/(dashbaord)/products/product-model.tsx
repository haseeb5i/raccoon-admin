'use client';

import React, { useEffect } from 'react';

// use hook form
import { Control, Controller, FieldErrors, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { Product } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from '@/redux/slice/productSlice';

// Utils
import { showToast } from '@/utils/toast';
import FileUpload from '@/components/FileUpload';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SelectProduct } from '@/components/SelectProduct';

const baseSchema = z.object({
  name: z.string().min(3),
  baseCost: z.coerce.number(),
  imageUrl: z.string().url(),
  type: z.enum(['Arrow', 'Bow', 'PowerUp']),
  arrowData: z
    .object({
      baseDamage: z.coerce.number().gte(0),
    })
    .optional(),
  bowData: z
    .object({
      damageAdd: z.coerce.number().gte(1),
    })
    .optional(),
  powerUpData: z.object({}).optional(),
  maxLevel: z.coerce.number(),
});

const createSchema = baseSchema.refine(d => {
  if (
    (d.type === 'Arrow' && !d.arrowData) ||
    (d.type === 'Bow' && !d.bowData) ||
    (d.type === 'PowerUp' && !d.powerUpData)
  ) {
    return false;
  }
  return true;
});

type FormType = z.infer<typeof baseSchema>;

const defaultValues: FormType = {
  baseCost: 0,
  imageUrl: '',
  name: '',
  maxLevel: -1,
  type: 'Arrow',
  arrowData: {
    baseDamage: 50,
  },
  bowData: {
    damageAdd: 1,
  },
  powerUpData: {},
};

const ProductModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: Product | null;
}) => {
  const [addProduct, { isLoading: isAddLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: isEditLoading }] = useUpdateProductMutation();

  const isLoading = isEditLoading || isAddLoading;

  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormType>({
    mode: 'onTouched',
    resolver: zodResolver(isEdit ? baseSchema : createSchema),
  });

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
        data?: Product;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editProduct({ data: formattedData, id: editData?.itemId })
        : await addProduct(formattedData);
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Weapon ${isEdit ? 'updated' : 'added'} successfully`,
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

  const productType = watch('type');
  const isArrow = productType === 'Arrow';
  const isBow = productType === 'Bow';
  // const isPowerUp = productType === "PowerUp"

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Weapon`}
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
              <Input label="Name" field={field} errors={errors} />
            )}
          />
          <Controller
            name="baseCost"
            control={control}
            render={({ field }) => (
              <Input label="Base Cost" type="number" field={field} errors={errors} />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SelectProduct skipEmpty value={field.value} onChange={field.onChange} />
            )}
          />
          <p className='text-sm text-foreground' >Weapon Data</p>
          {isBow && <BowForm control={control} errors={errors} />}
          {isArrow && <ArrowForm control={control} errors={errors} />}
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <div>
                <p className="text-sm text-foreground">Upload Image</p>
                <FileUpload
                  {...field}
                  onError={message => showToast({ message, type: 'error' })}
                />
                <ErrorMessage errorMsg={errors.imageUrl?.message} />
              </div>
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

type SubFormProps = {
  control: Control<FormType>;
  errors: FieldErrors<FormType>;
};

const ArrowForm = ({ control, errors }: SubFormProps) => {
  return (
    <div className="mb-3 flex flex-col gap-3">
      <Controller
        name="arrowData.baseDamage"
        shouldUnregister
        control={control}
        render={({ field }) => (
          <Input label="Base Damage" type="number" field={field} errors={errors} />
        )}
      />
    </div>
  );
};

const BowForm = ({ control, errors }: SubFormProps) => {
  return (
    <div className="mb-3 flex flex-col gap-3">
      <Controller
        shouldUnregister
        name="bowData.damageAdd"
        control={control}
        render={({ field }) => (
          <Input label="Damage Multiplier" type="number" field={field} errors={errors} />
        )}
      />
    </div>
  );
};

export default ProductModel;
