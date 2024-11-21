import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userSlice = createApi({
  reducerPath: 'userSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: headers => {
      const token = getCookie(SHADOWNET_TOKEN);
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: builder => ({
    allUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/users?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    addUser: builder.mutation({
      query: data => ({
        url: '/users/user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useAllUsersQuery, useAddUserMutation } = userSlice;
