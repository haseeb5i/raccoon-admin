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
import { minErrorMsg, requiredErrorMsg } from '@/utils/helper';
import FileUpload from '@/components/FileUpload';
import { MdAddCircleOutline, MdClear as MdClearIcon } from 'react-icons/md';
import { DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';

type FormType = Omit<
  Task,
  'taskId' | 'createdAt' | 'updatedAt' | 'metadata' | 'expiresAt'
> & {
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
  } = useForm<FormType>({ mode: 'onTouched' });

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
      if (res?.data) {
        showToast({
          message: `Task ${isEdit ? 'updated' : 'added'} successfully`,
          type: 'success',
        });
      }
      console.log(data, formattedData)
    } catch (error) {
      showToast({ message: 'An error occurred', type: 'error' });
      console.error('error on login', error);
    } finally {
      // setOpen(false);
      // reset();
    }
  };

  const taskType = watch('type');
  const isDailyReward = taskType === 1;
  const linkRequired = taskType === 2 || taskType === 9;
  const requireTweetId = taskType === 5 || taskType === 6;
  const requireUsername = taskType === 7;
  const isTwitterTask = requireTweetId || requireUsername;
  const metaKey = requireTweetId ? 'tweetId' : 'targetUsername';

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
            rules={{
              required: requiredErrorMsg('Task Name'),
            }}
            control={control}
            render={({ field }) => (
              <Input label="Task Name" field={field} errors={errors} />
            )}
          />

          <Controller
            name="link"
            rules={{
              required: linkRequired ? requiredErrorMsg('Task Link') : undefined,
            }}
            control={control}
            render={({ field }) => (
              <Input label="Task LInk" field={field} errors={errors} />
            )}
          />
          <Controller
            name="rewardCoins"
            rules={{
              required: requiredErrorMsg('Reward points'),
              min: { value: 0, message: minErrorMsg('Reward points', 0) },
            }}
            control={control}
            render={({ field }) => (
              <Input label="Reward Points" type="number" field={field} errors={errors} />
            )}
          />

          <Controller
            name="type"
            control={control}
            rules={{
              required: requiredErrorMsg('Task Type'),
            }}
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
            rules={{
              required: taskType === 9 ? requiredErrorMsg('Expires At') : undefined,
            }}
            render={({ field }) => (
              <DateInput
                {...field}
                classNames={{
                  label: 'text-default-400 text-xs',
                  segment: "text-foreground sm:text-xs text-xs"
                }}
                minValue={today(getLocalTimeZone())}
                label="Expires At"
                isInvalid={!!errors.expirey?.message}
                errorMessage={errors.expirey?.message?.toString()}
              />
            )}
          />

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
          {isTwitterTask && (
            <div className="flex items-center gap-5">
              <span className="text-sm">
                {requireTweetId ? 'Tweet Id' : 'Target Username'}
              </span>
              <Controller
                name={metaKey}
                rules={{ required: requiredErrorMsg(metaKey) }}
                shouldUnregister
                control={control}
                render={({ field }) => (
                  <Input type="text" field={field} errors={errors} />
                )}
              />
            </div>
          )}

          <Controller
            name="iconUrl"
            rules={{
              required: requiredErrorMsg('Task Icon'),
            }}
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
  control: Control<FormType, any>;
  errors: FieldErrors<FormType>;
};

const AddStreakRewards = ({ control, errors }: AddStreakRewardsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'streakRewards',
    shouldUnregister: true,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm">Streak Rewards</span>
        <Button
          isIconOnly
          onClick={() => append({ dayCount: fields.length + 1, rewardCoins: '' })}
        >
          <MdAddCircleOutline />
        </Button>
      </div>

      {fields.map((field, index) => (
        <div className="flex items-center gap-4" key={field.id}>
          <Controller
            name={`streakRewards.${index}.dayCount`}
            rules={{
              min: { value: 0, message: minErrorMsg('Day Count', 0) },
            }}
            control={control}
            render={({ field }) => (
              <Input label="Day Count" readOnly field={field} errors={errors} />
            )}
          />

          <Controller
            name={`streakRewards.${index}.rewardCoins`}
            rules={{
              min: { value: 0, message: minErrorMsg('Reward points', 0) },
            }}
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
  { key: 1, label: 'Daily Reward' },
  // { key: '2', label: 'Quest' },
  // { key: '3', label: 'Ad' },
  { key: '4', label: 'Referral' },
  { key: '5', label: 'xRetweet' },
  { key: '6', label: 'xReply' },
  { key: '7', label: 'xFollow' },
  { key: '9', label: 'dailyVideo' },
];

export default TaskModel;
