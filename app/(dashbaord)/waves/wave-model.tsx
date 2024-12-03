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
import { Wave } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import {
  useAddWaveMutation,
  useAllEnemiesQuery,
  useUpdateWaveMutation,
} from '@/redux/slice/gameSlice';

// Utils
import { showToast } from '@/utils/toast';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { MdAddCircleOutline, MdClear as MdClearIcon } from 'react-icons/md';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  arrowDropMultiplier: z.coerce.number().gt(0),
  arrowsForWave: z.coerce.number().gt(0),
  spawnRate: z.coerce.number().gt(0),
  speedMultiplier: z.coerce.number().gt(0),
  enemyTypes: z
    .array(
      z.object({
        count: z.coerce.number().gt(0),
        enemyTypeId: z.number(),
      })
    )
    .min(1),
});

type FormType = z.infer<typeof schema>;
const defaultValues: FormType = {
  arrowDropMultiplier: 1,
  arrowsForWave: 10,
  spawnRate: 1,
  speedMultiplier: 2,
  enemyTypes: [{ count: 1, enemyTypeId: 1 }],
};

const WaveModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: Wave | null;
}) => {
  const [addWave, { isLoading: isAddLoading }] = useAddWaveMutation();
  const [editWave, { isLoading: isEditLoading }] = useUpdateWaveMutation();

  const isLoading = isEditLoading || isAddLoading;

  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm<FormType>({ resolver: zodResolver(schema), mode: 'onTouched' });

  useEffect(() => {
    if (isEdit && editData) {
      reset({ ...editData, enemyTypes: editData.enemiesPerType });
    } else {
      reset(defaultValues);
    }
  }, [editData, isEdit, setValue, reset]);

  const onSubmit = async (data: FormType) => {
    try {
      const formattedData: FormType = {
        ...data,
        enemyTypes: data.enemyTypes.map(d => ({ ...d, count: +d.count })),
      };
      const res: {
        data?: Wave;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editWave({ data: formattedData, id: editData?.waveId })
        : await addWave(formattedData);
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Wave ${isEdit ? 'updated' : 'added'} successfully`,
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
      title={`${isEdit ? 'Edit' : 'Add'} Wave`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="arrowsForWave"
            control={control}
            render={({ field }) => (
              <Input
                label="Arrows Available"
                type="number"
                field={field}
                errors={errors}
              />
            )}
          />
          <Controller
            name="arrowDropMultiplier"
            control={control}
            render={({ field }) => (
              <Input
                label="Arrow Drop Mult"
                type="number"
                field={field}
                errors={errors}
              />
            )}
          />
          <Controller
            name="spawnRate"
            control={control}
            render={({ field }) => (
              <Input label="Spawn Rate" type="number" field={field} errors={errors} />
            )}
          />
          <Controller
            name="speedMultiplier"
            control={control}
            render={({ field }) => (
              <Input label="Speed Mult" type="number" field={field} errors={errors} />
            )}
          />
          <AddEnemyInWave control={control} errors={errors} />
        </div>
      </form>
    </Modal>
  );
};

type AddEnemyInWaveProps = {
  control: Control<FormType, unknown>;
  errors: FieldErrors<FormType>;
};

const AddEnemyInWave = ({ control, errors }: AddEnemyInWaveProps) => {
  const { data: enemyTypes, isLoading } = useAllEnemiesQuery({ page: 1, limit: 100 });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'enemyTypes',
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm">Enemies In Wave</span>
        <Button isIconOnly onClick={() => append({ count: 1, enemyTypeId: 1 })}>
          <MdAddCircleOutline />
        </Button>
      </div>

      {fields.map((field, index) => (
        <div className="flex items-start gap-4" key={field.id}>
          <Controller
            name={`enemyTypes.${index}.enemyTypeId`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={undefined}
                size="sm"
                isLoading={isLoading}
                variant="bordered"
                color="primary"
                items={enemyTypes?.data ?? []}
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
                label="Enemy Type"
              >
                {item => <SelectItem key={item.enemyTypeId}>{item.enemyType}</SelectItem>}
              </Select>
            )}
          />
          <Controller
            name={`enemyTypes.${index}.count`}
            control={control}
            render={({ field }) => (
              <Input label="Count" type="number" field={field} errors={errors} />
            )}
          />
          <Button onClick={() => remove(index)}>
            <MdClearIcon />
          </Button>
        </div>
      ))}
    </>
  );
};

export default WaveModel;
