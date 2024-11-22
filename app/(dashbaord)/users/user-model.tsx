'use client';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';
import { Switch } from '@nextui-org/switch';

// Types
import { User } from '@/types/commonTypes';

// Redux
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useUpdateUserMutation } from '@/redux/slice/userSlice';

// Utils
import { showToast } from '@/utils/toast';
import { requiredErrorMsg } from '@/utils/helper';
import { useEffect } from 'react';

type FormType = {
  username: string;
  active: boolean;
};

const UserModel = ({
  open,
  setOpen,
  editData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData?: User | null;
}) => {
  const [editUser, { isLoading }] = useUpdateUserMutation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormType>({ mode: 'onTouched' });

  const onSubmit = async (data: FormType) => {
    try {
      const res: {
        data?: User;
        error?: FetchBaseQueryError | SerializedError;
      } = await editUser({ data, id: editData?.tgId });

      if (res?.data) {
        showToast({
          message: `User update successfully`,
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

  useEffect(() => {
    if (editData) {
      reset({
        username: editData.username,
        active: editData.active,
      });
    }
  }, [editData, reset]);

  return (
    <Modal
      title={'Edit User'}
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonLoading={isLoading}
      primaryButtonLabel={'Update'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="username"
            rules={{
              required: requiredErrorMsg('User Name'),
            }}
            control={control}
            render={({ field }) => (
              <Input label="User Name" field={field} errors={errors} />
            )}
          />

          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Switch
                size="sm"
                classNames={{ label: 'text-sm' }}
                isSelected={field.value}
                onValueChange={field.onChange}
              >
                User Active
              </Switch>
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UserModel;
