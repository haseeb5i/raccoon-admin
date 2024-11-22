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

const LoginForm = () => {
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
        const userData = { id: 1, name: 'Admin' };

        setCookie(SHADOWNET_TOKEN, data.apiKey);
        setCookie(SHADOWNET_USER, JSON.stringify(userData));
        router.push('/');

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
              name="apiKey"
              control={control}
              rules={{ required: 'apiKey is required' }}
              render={({ field }) => (
                <Input
                  label="Api Key"
                  name="apiKey"
                  field={field}
                  type="password"
                  errors={errors}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Button
        size="md"
        fullWidth
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
