import { DashboardData } from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardSlice = createApi({
  reducerPath: 'dashboardSlice',
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
  tagTypes: ['Dashboard'],
  endpoints: builder => ({
    getDashboard: builder.query({
      query: () => ({
        url: `/users/dash`,
        method: 'GET',
      }),
      transformResponse: ({ data }: { data: DashboardData }) => {
        return {
          ...data,
          activeUsers: data.activeUsers.map(item => ({
            x: item.timestamp,
            y: item.count,
          })),
          newUsers: data.newUsers.map(item => ({
            x: item.timestamp,
            y: item.count,
          })),
        };
      },
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardSlice;
