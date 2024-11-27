import { FindAllParams, Paginated, Clan, ClanWithKey } from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clanSlice = createApi({
  reducerPath: 'clanSlice',
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
  tagTypes: ['Clan'],
  endpoints: builder => ({
    addClan: builder.mutation({
      query: data => ({
        url: '/clans',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Clan'],
    }),

    allClans: builder.query<Paginated<ClanWithKey>, FindAllParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/clans?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Clan>) => {
        return {
          ...response,
          data: response.data.map(item => ({ ...item, key: item.clanId })),
        };
      },
      providesTags: ['Clan'],
    }),

    updateClan: builder.mutation({
      query: ({ data, id }) => ({
        url: `/clans/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Clan'],
    }),

    deleteClan: builder.mutation({
      query: id => ({
        url: `clans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clan'],
    }),

    clanById: builder.query<Clan, number>({
      query: id => ({ url: `/clans/${id}`, method: 'GET' }),
    }),
  }),
});

export const {
  useAddClanMutation,
  useAllClansQuery,
  useUpdateClanMutation,
  useDeleteClanMutation,
  useClanByIdQuery,
} = clanSlice;
