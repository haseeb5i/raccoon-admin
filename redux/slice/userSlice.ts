import { FindAllParams, Paginated, User, UserWithKey } from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userSlice = createApi({
  reducerPath: 'userSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: headers => {
      const apiKey = getCookie(SHADOWNET_TOKEN);
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      if (apiKey) {
        headers.set('x-admin-api-key', apiKey);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: builder => ({
    allUsers: builder.query<Paginated<UserWithKey>, FindAllParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/users?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<User>) => {
        return {
          ...response,
          data: response.data.map(item => ({
            ...item,
            key: item.tgId,
            isActive: item.active ? 'Yes' : 'No',
          })),
        };
      },
      providesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: ({ data, id }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    userById: builder.query<User, number>({
      query: id => ({ url: `/user-builds/${id}`, method: 'GET' }),
    }),
  }),
});

export const { useAllUsersQuery, useUpdateUserMutation, useUserByIdQuery } = userSlice;
