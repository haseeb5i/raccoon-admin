import {
  FindAllParams,
  Paginated,
  TableSortType,
  User,
  UserProfile,
  UserWithKey,
} from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type FindUserParams = FindAllParams & {
  sorting: TableSortType;
  filters: { username?: string; clanId?: number };
};

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
    allUsers: builder.query<Paginated<UserWithKey>, FindUserParams>({
      query: ({ page = 1, limit = 10, filters, sorting, dateRange }) => {
        const sorter: Record<string, string> = {};
        const { column, direction } = sorting;
        if (column && direction) {
          sorter._sort = column as string;
          sorter._order = direction === 'ascending' ? 'asc' : 'desc';
        }
        return {
          url: '/users',
          params: { page, limit, dateRange, ...filters, ...sorter },
          method: 'GET',
        };
      },
      transformResponse: (response: Paginated<User>) => {
        return {
          ...response,
          data: response.data.map(item => ({
            ...item,
            key: item.tgId,
            clanName: item.clan.name,
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

    userById: builder.query<UserProfile, string>({
      query: id => ({ url: `/users/${id}`, method: 'GET' }),
      transformResponse: (response: { data: UserProfile }) => {
        return response.data;
      },
    }),
  }),
});

export const { useAllUsersQuery, useUpdateUserMutation, useUserByIdQuery } = userSlice;
