import {
  FindAllParams,
  Paginated,
  EnemyWithKey,
  Enemy,
  WaveWithKey,
  Wave,
  Level,
  Catapult,
} from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const gameSlice = createApi({
  reducerPath: 'gameSlice',
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
  tagTypes: ['Game'],
  endpoints: builder => ({
    allEnemies: builder.query<Paginated<EnemyWithKey>, FindAllParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/game?type=enemy&page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Enemy>) => {
        return {
          ...response,
          data: response.data.map(item => ({ ...item, key: item.enemyTypeId })),
        };
      },
      providesTags: [{ type: 'Game', id: 'Enemy' }],
    }),
    addEnemy: builder.mutation({
      query: data => ({
        url: '/game/enemy',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Game', id: 'Enemy' }],
    }),
    updateEnemy: builder.mutation({
      query: ({ data, id }) => ({
        url: `/game/enemy/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Game', id: 'Enemy' }],
    }),
    deleteEnemy: builder.mutation({
      query: id => ({
        url: `/game/enemy/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Game', id: 'Enemy' }],
    }),

    allWaves: builder.query<Paginated<WaveWithKey>, FindAllParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/game?type=wave&page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Wave>) => {
        return {
          ...response,
          data: response.data.map(item => ({ ...item, key: item.waveId })),
        };
      },
      providesTags: [{ type: 'Game', id: 'Wave' }],
    }),
    addWave: builder.mutation({
      query: data => ({
        url: '/game/wave',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Game', id: 'Wave' }],
    }),
    updateWave: builder.mutation({
      query: ({ data, id }) => ({
        url: `/game/wave/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Game', id: 'Wave' }],
    }),

    allLevels: builder.query({
      query: () => ({
        url: `/game?type=level`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Level>) => {
        return {
          ...response,
          data: response.data.map(item => ({ ...item, key: item.id })),
        };
      },
      providesTags: [{ type: 'Game', id: 'Level' }],
    }),
    addLevel: builder.mutation({
      query: data => ({
        url: '/game/level',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Game', id: 'Level' }],
    }),
    updateLevel: builder.mutation({
      query: ({ data, id }) => ({
        url: `/game/level/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Game', id: 'Level' }],
    }),
    deleteLevel: builder.mutation({
      query: id => ({
        url: `/game/level/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Game', id: 'Level' }],
    }),

    allCatapults: builder.query({
      query: () => ({
        url: `/game?type=catapult`,
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Catapult>) => {
        return {
          ...response,
          data: response.data.map(item => ({ ...item, key: item.id })),
        };
      },
      providesTags: [{ type: 'Game', id: 'Catapult' }],
    }),
    updateCatapult: builder.mutation({
      query: ({ data, id }) => ({
        url: `/game/catapult/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Game', id: 'Catapult' }],
    }),
  }),
});

export const {
  useAllWavesQuery,
  useAllEnemiesQuery,
  useAddEnemyMutation,
  useDeleteEnemyMutation,
  useUpdateEnemyMutation,
  useAddWaveMutation,
  useUpdateWaveMutation,
  useAllLevelsQuery,
  useAddLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
  useAllCatapultsQuery,
  useUpdateCatapultMutation,
} = gameSlice;
