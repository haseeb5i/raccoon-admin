import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const loginSlice = createApi({
  reducerPath: 'loginSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: userData => ({
        url: '/auth/check-key',
        method: 'POST',
        body: userData,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    register: builder.mutation({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = loginSlice;
