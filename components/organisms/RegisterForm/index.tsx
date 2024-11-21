'use client';

import { useRef } from 'react';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Text from '@/components/atoms/commonText';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/InputField';

// Redux
import { useRegisterMutation } from '@/redux/slice/loginSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { showToast } from '@/utils/toast';

// Types
import { RegisterType } from '@/types/loginTypes';

type PropsTypes = {
  setActive: React.Dispatch<React.SetStateAction<number>>;
};

const RegisterForm = ({ setActive }: PropsTypes) => {
  const [register, { isLoading }] = useRegisterMutation({});

  const {
    formState: { errors },
    handleSubmit,
    watch,
    control,
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
      } = await register(formattedData);

      if (res?.data) {
        showToast({
          message: 'Account created successfully',
          type: 'success',
        });
        setActive(1);
      }

      if (res.error) {
        showToast({
          message: res.error?.data?.message as string,
          type: 'error',
        });
      }
    } catch (error) {
      showToast({
        message: 'An error occurred',
        type: 'error',
      });
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-16">
        <Text
          containerTag="h2"
          className="mb-1 text-left font-fontBold text-4xl font-bold text-primary"
        >
          Sign Up
        </Text>

        <Text containerTag="h2" className="text-xs font-light">
          Hey enter your details to sign up to your account
        </Text>
      </div>

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
            validate: value => value === Password.current || 'The passwords do not match',
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

      <Text containerTag="h2" className="mb-8 text-pretty text-xs font-medium">
        By signing up, you agree to our
        <span className="cursor-pointer text-primary"> Terms & Conditions </span>
        and <span className="cursor-pointer text-primary"> Privacy Policy </span>
      </Text>

      <Button
        size="md"
        fullWidth
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Sign Up
      </Button>

      <Text containerTag="h2" className="mt-1 text-xs font-medium">
        {`Already have an account?`}{' '}
        <span
          className="cursor-pointer font-bold text-primary"
          onClick={() => setActive(1)}
        >
          Sign In
        </span>
      </Text>
    </form>
  );
};

export default RegisterForm;
