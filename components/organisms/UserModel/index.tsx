'use client';

import React from 'react';
import { useRef } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/InputField';

// Types
import { RegisterType } from '@/types/loginTypes';

// Redux
import { useAddUserMutation } from '@/redux/slice/userSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { showToast } from '@/utils/toast';

const UserModel = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [addUser, { isLoading }] = useAddUserMutation();

  const {
    formState: { errors },
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
  } = useForm<RegisterType>({
    mode: 'onTouched',
  });

  const Password = useRef({});
  Password.current = watch('password', '');

  const onSubmit = async (data: RegisterType) => {
    const formattedData = {
      name: data.username.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    };

    try {
      const res: {
        data?: RegisterType;
        error?: FetchBaseQueryError | SerializedError;
      } = await addUser(formattedData);

      if (res?.data) {
        showToast({
          message: 'Account created successfully',
          type: 'success',
        });
      }
    } catch (error) {
      showToast({
        message: 'An error occurred',
        type: 'error',
      });
      console.error(error);
    } finally {
      setOpen(false);
      reset();
      setValue('password', '');
      setValue('confirmPassword', '');
      setValue('username', '');
      setValue('email', '');
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={() => {
        handleSubmit(onSubmit)();
      }}
      primaryButtonLoading={isLoading}
      title="Add User"
      primaryButtonLabel="Add"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 flex flex-col gap-3">
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Username is required',
              minLength: {
                value: 6,
                message: 'Username must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <Input label="Username" name="Username" field={field} errors={errors} />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <Input label="Email" name="Email" field={field} errors={errors} />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <Input
                label="Password"
                name="Password"
                field={field}
                type="password"
                errors={errors}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: 'Confirm Password is required',
              validate: value =>
                value === Password.current || 'The passwords do not match',
            }}
            render={({ field }) => (
              <Input
                label="Confirm Password"
                name="ConfirmPassword"
                field={field}
                type="password"
                errors={errors}
              />
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UserModel;
