'use client';

import React, { useEffect } from 'react';
import { Select, SelectItem, Switch } from '@nextui-org/react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

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

type FormType = Omit<Task, 'taskId' | 'createdAt' | 'updatedAt'>;

const defaultValues: FormType = {
  repeatable: false,
  rewardPoints: 100,
  taskLink: 'https://example.com',
  taskTitle: 'Test Task',
  taskType: 2,
  iconUrl: 'https://playbrainz-data.s3.amazonaws.com/game-images%2Fpoint-button.png',
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
      reset(editData);
    } else {
      reset(defaultValues);
    }
  }, [editData, isEdit, setValue, reset]);

  const onSubmit = async (data: FormType) => {
    try {
      const formattedData: FormType = {
        ...data,
        rewardPoints: Number(data.rewardPoints),
      };
      const res: {
        data?: Task;
        error?: FetchBaseQueryError | SerializedError;
      } = isEdit
        ? await editTask({ data: formattedData, id: editData?.taskId })
        : await addTask(formattedData);
      if (res?.data) {
        showToast({
          message: `Build ${isEdit ? 'update' : 'add'} successfully`,
          type: 'success',
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

  const taskType = watch('taskType');
  const linkRequired = taskType === 2 || taskType === 3;

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} Build`}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={isEdit ? 'Update' : 'Add'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="taskTitle"
            rules={{
              required: requiredErrorMsg('Task Name'),
            }}
            control={control}
            render={({ field }) => (
              <Input label="Task Name" field={field} errors={errors} />
            )}
          />

          <Controller
            name="taskLink"
            rules={{
              required: linkRequired ? requiredErrorMsg('Task Link') : undefined,
            }}
            control={control}
            render={({ field }) => (
              <Input label="Task LInk" field={field} errors={errors} />
            )}
          />
          <Controller
            name="rewardPoints"
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
            name="taskType"
            control={control}
            rules={{
              required: requiredErrorMsg('Task Type'),
            }}
            render={({ field }) => (
              <Select
                {...field}
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
                label="Select Task Type"
                isInvalid={Boolean(errors.taskType?.message)}
                errorMessage={errors.taskType?.message}
              >
                {taskTypes.map(item => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>
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

export const taskTypes = [
  { key: '2', label: 'Quest' },
  { key: '3', label: 'Ad' },
  { key: '1', label: 'Daily Reward' },
  { key: '4', label: 'Referral' },
];

export default TaskModel;
