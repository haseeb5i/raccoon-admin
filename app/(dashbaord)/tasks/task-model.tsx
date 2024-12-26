'use client';

import React, { useEffect } from 'react';
import { Button, DateInput, Select, SelectItem, Switch } from '@nextui-org/react';

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
import { Task } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAddTaskMutation, useUpdateTaskMutation } from '@/redux/slice/taskSlice';

// Utils
import { showToast } from '@/utils/toast';
import FileUpload from '@/components/FileUpload';
import { MdAddCircleOutline, MdClear as MdClearIcon } from 'react-icons/md';
import { DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

function getPath(taskType: number) {
  const linkRequired = taskType === 2 || taskType === 9;
  if (linkRequired) return 'link';

  const requireTweetId = taskType === 5 || taskType === 6;
  if (requireTweetId) return 'tweetId';

  const requireUsername = taskType === 7;
  if (requireUsername) return 'targetUsername';

  const requireWaveNum = taskType === 12;
  if (requireWaveNum) return 'targetWave';

  return null;
}

const schema = z
  .object({
    title: z.string().min(3),
    link: z.string().url().or(z.literal('')),
    rewardCoins: z.coerce.number().gte(0),
    repeatable: z.boolean(),
    type: z.number().gt(0),
    iconUrl: z.string().url(),
    tweetId: z.string().optional(),
    targetUsername: z.string().optional(),
    targetWave: z.number().optional(),
    streakRewards: z.array(
      z.object({
        dayCount: z.number().gt(0),
        rewardCoins: z.coerce.number().gt(0),
      })
    ),
  })
  .refine(
    data => {
      const p = getPath(data.type);
      if (p === 'link' && !data.link) return false;
      if (p === 'targetUsername' && !data.targetUsername) return false;
      if (p === 'tweetId' && !data.tweetId) return false;
      if (p === 'targetWave' && !data.targetWave) return false;
      return true;
    },
    data => ({
      message: `${getPath(data.type)} is rquired`,
      path: [getPath(data.type) ?? ''],
    })
  );
type FormType = z.infer<typeof schema> & {
  expirey?: DateValue | null;
};

const defaultValues: FormType = {
  repeatable: false,
  rewardCoins: 100,
  link: 'https://example.com',
  title: 'Test Task',
  type: 9,
  iconUrl: 'https://playbrainz-data.s3.amazonaws.com/game-images%2Fcoin.webp',
  streakRewards: [],
};

const TaskModel = ({
  open,
  setOpen,
  isEdit,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  editData?: Task | null;
}) => {
  const [addTask, { isLoading: isAddLoading }] = useAddTaskMutation();
  const [editTask, { isLoading: isEditLoading }] = useUpdateTaskMutation();

  const isLoading = isEditLoading || isAddLoading;

  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormType>({ mode: 'onTouched', resolver: zodResolver(schema) });

  useEffect(() => {
    if (isEdit && editData) {
      let expirey: DateValue | undefined;
      if (editData.expiresAt) {
        expirey = parseDate(editData.expiresAt);
      }
      reset({
        ...editData,
        expirey,
        link: editData.link ?? '',
        ...editData.metadata,
      });
    } else {
      reset(defaultValues);
    }
  }, [editData, isEdit, setValue, reset]);

  const onSubmit = async (data: FormType) => {
    try {
      const formattedData: FormType = {
        ...data,
        rewardCoins: Number(data.rewardCoins),
        streakRewards: data.streakRewards?.map(d => ({
          ...d,
          rewardCoins: Number(d.rewardCoins),
        })),
      };
      const res: {
        data?: Task;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editTask({ data: formattedData, id: editData?.taskId })
        : await addTask(formattedData);
      console.log('res', res);
      if (res?.data) {
        showToast({
          type: 'success',
          message: `Task ${isEdit ? 'updated' : 'added'} successfully`,
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

  const taskType = watch('type');
  const isDailyReward = taskType === 1;
  const metaKey = getPath(taskType);
  const isTwitterTask = metaKey === 'tweetId' || metaKey === 'targetUsername';
  const isGameTask = metaKey === 'targetWave';

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Task`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input label="Task Name" field={field} errors={errors} />
            )}
          />

          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <Input label="Task LInk" field={field} errors={errors} />
            )}
          />
          <Controller
            name="rewardCoins"
            control={control}
            render={({ field }) => (
              <Input label="Reward Points" type="number" field={field} errors={errors} />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={undefined}
                size="sm"
                variant="bordered"
                color="primary"
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
                label="Select Task Type"
                isInvalid={Boolean(errors.type?.message)}
                errorMessage={errors.type?.message}
              >
                {taskTypes.map(item => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="expirey"
            control={control}
            render={({ field }) => (
              <DateInput
                {...field}
                classNames={{
                  label: 'text-default-400 text-xs',
                  segment: 'text-foreground sm:text-xs text-xs',
                }}
                minValue={today(getLocalTimeZone())}
                label="Expires At"
                isInvalid={!!errors.expirey?.message}
                errorMessage={errors.expirey?.message?.toString()}
              />
            )}
          />

          {isTwitterTask && (
            <Controller
              name={metaKey}
              shouldUnregister
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label={metaKey === 'tweetId' ? 'Tweet Id' : 'Target Username'}
                  field={field}
                  errors={errors}
                />
              )}
            />
          )}

          {isGameTask && (
            <Controller
              name="targetWave"
              shouldUnregister
              control={control}
              render={({ field }) => (
                <Input type="text" label={'Target Wave'} field={field} errors={errors} />
              )}
            />
          )}

          <Controller
            name="repeatable"
            control={control}
            render={({ field }) => (
              <Switch
                size="sm"
                classNames={{ label: 'text-sm' }}
                isSelected={field.value}
                onValueChange={field.onChange}
              >
                Repeatable Task
              </Switch>
            )}
          />

          {isDailyReward && <AddStreakRewards control={control} errors={errors} />}

          <Controller
            name="iconUrl"
            control={control}
            render={({ field }) => (
              <FileUpload
                {...field}
                onError={message => showToast({ message, type: 'error' })}
              />
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

type AddStreakRewardsProps = {
  control: Control<FormType, unknown>;
  errors: FieldErrors<FormType>;
};

const AddStreakRewards = ({ control, errors }: AddStreakRewardsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'streakRewards',
    // shouldUnregister: true,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm">Streak Rewards</span>
        <Button
          isIconOnly
          onClick={() => append({ dayCount: fields.length + 1, rewardCoins: 0 })}
        >
          <MdAddCircleOutline />
        </Button>
      </div>

      {fields.map((field, index) => (
        <div className="flex items-start gap-4" key={field.id}>
          <Controller
            name={`streakRewards.${index}.dayCount`}
            control={control}
            render={({ field }) => (
              <Input label="Day Count" readOnly field={field} errors={errors} />
            )}
          />

          <Controller
            name={`streakRewards.${index}.rewardCoins`}
            control={control}
            render={({ field }) => (
              <Input label="Reward Coins" field={field} errors={errors} />
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

export const taskTypes = [
  { key: '1', label: 'Daily Reward' },
  { key: '9', label: 'Daily Video' },
  // { key: '2', label: 'Quest' },
  // { key: '3', label: 'Ad' },
  { key: '4', label: 'Referral' },
  { key: '5', label: 'xRetweet' },
  { key: '6', label: 'xReply' },
  { key: '7', label: 'xFollow' },
  { key: '12', label: 'Max Wave' },
];

export default TaskModel;
