'use client';

import { useRouter } from 'next/navigation';

// use hook form
import { Controller, useForm } from 'react-hook-form';

// Components
import Text from '@/components/atoms/commonText';
import Input from '@/components/atoms/InputField';
import Button from '@/components/atoms/Button';

// Types
import { LoginData, LoginType } from '@/types/loginTypes';

// Redux
import { useLoginMutation } from '@/redux/slice/loginSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { SHADOWNET_TOKEN, SHADOWNET_USER } from '@/utils/constant';
import { setCookie } from '@/utils/cookie';
import { showToast } from '@/utils/toast';

type PropsTypes = {
  setActive: React.Dispatch<React.SetStateAction<number>>;
};

const LoginForm = ({ setActive }: PropsTypes) => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation({});

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<LoginType>({
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginType) => {
    try {
      const res: {
        data?: LoginData;
        error?: FetchBaseQueryError | SerializedError;
      } = await login(data);

      if (res?.data) {
        const { accessToken } = res.data;
        const userData = JSON.stringify(res.data.user);

        setCookie(SHADOWNET_TOKEN, accessToken);
        setCookie(SHADOWNET_USER, userData);
        await router.push('/');

        showToast({
          type: 'success',
          message: 'Login successful',
        });
      }
    } catch (error) {
      console.error('error on login', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-16">
        <Text
          containerTag="h2"
          className="mb-1 text-left font-fontBold text-4xl font-bold text-primary"
        >
          Sign In
        </Text>

        <Text containerTag="h2" className="text-xs font-light">
          Hey enter your details to sign in to your account
        </Text>
      </div>

      <div className="mb-3">
        <div className="mb-6">
          <div className="mb-5">
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
                <Input label="Email" name="email" field={field} errors={errors} />
              )}
            />
          </div>
          <div className="mb-5">
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
              }}
              render={({ field }) => (
                <Input
                  label="Password"
                  name="password"
                  field={field}
                  type="password"
                  errors={errors}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Text containerTag="h2" className="mb-3 text-pretty text-xs font-medium">
        Having trouble signing in?
      </Text>

      <Button
        size="md"
        fullWidth
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Sign In
      </Button>

      <Text containerTag="h2" className="mt-2 text-xs font-medium">
        {`Don't`} have an account?{' '}
        <span className="cursor-pointer text-primary" onClick={() => setActive(2)}>
          Sign Up
        </span>
      </Text>
    </form>
  );
};

export default LoginForm;
