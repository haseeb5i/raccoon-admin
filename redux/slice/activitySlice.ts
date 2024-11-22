import {
  FindAllParams,
  Paginated,
  TapActivity,
  TapActivityWithKey,
  TaskActivity,
  TaskActivityWithKey,
} from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const activitySlice = createApi({
  reducerPath: 'taskActivitySlice',
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
  tagTypes: ['Activity'],
  endpoints: builder => ({
    allTaskActivity: builder.query<Paginated<TaskActivityWithKey>, FindAllParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/task-activity?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<TaskActivity>) => {
        return {
          ...response,
          data: response.data.map(item => ({
            key: item.taskActivityId,
            taskTitle: item.task.title,
            taskUser: item.user.username,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        };
      },
      providesTags: [{ type: 'Activity', id: 'Task' }],
    }),

    allTapActivity: builder.query<Paginated<TapActivityWithKey>, FindAllParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/tap-activity?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<TapActivity>) => {
        return {
          ...response,
          data: response.data.map(item => ({
            ...item,
            key: item.tapActivityId,
            tapUser: item.user.username,
          })),
        };
      },
      providesTags: [{ type: 'Activity', id: 'Tap' }],
    }),

    taskActivityById: builder.query<TaskActivity, number>({
      query: id => ({ url: `/task-activity/${id}`, method: 'GET' }),
    }),

    tapActivityById: builder.query<TapActivity, number>({
      query: id => ({ url: `/task-activity/${id}`, method: 'GET' }),
    }),
  }),
});

export const {
  useAllTaskActivityQuery,
  useAllTapActivityQuery,
  useTaskActivityByIdQuery,
  useTapActivityByIdQuery,
} = activitySlice;
