import { FindAllParams, Paginated, Task, TaskWithKey } from '@/types/commonTypes';
import { SHADOWNET_TOKEN, taskTypeLookup } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const taskSlice = createApi({
  reducerPath: 'taskSlice',
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
  tagTypes: ['Task'],
  endpoints: builder => ({
    addTask: builder.mutation({
      query: data => ({
        url: '/tasks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),

    allTasks: builder.query<Paginated<TaskWithKey>, FindAllParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/tasks?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Task >) => {
        return {
          ...response,
          data: response.data.map(item => ({
            ...item,
            key: item.taskId,
            canRepeat: item.repeatable ? 'Yes' : 'No',
            taskLink: item.link ?? '',
            typeLabel: taskTypeLookup[item.type],
          })),
        };
      },
      providesTags: ['Task'],
    }),

    updateTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),

    deleteTask: builder.mutation({
      query: id => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

    taskById: builder.query<Task, number>({
      query: id => ({ url: `/tasks/${id}`, method: 'GET' }),
    }),
  }),
});

export const {
  useAddTaskMutation,
  useAllTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useTaskByIdQuery,
} = taskSlice;
