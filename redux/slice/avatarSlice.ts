import { FindAllParams, Paginated, Avatar, AvatarWithKey } from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type FindAvatarParams = FindAllParams & {
  clanId?: number;
};

export const avatarSlice = createApi({
  reducerPath: 'avatarSlice',
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
  tagTypes: ['Avatar'],
  endpoints: builder => ({
    addAvatar: builder.mutation({
      query: data => ({ url: '/avatars', method: 'POST', body: data }),
      invalidatesTags: ['Avatar'],
    }),
    allAvatars: builder.query<Paginated<AvatarWithKey>, FindAvatarParams>({
      query: ({ page = 1, limit = 10, clanId }) => ({
        url: '/avatars',
        params: { clanId, page, limit },
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Avatar>) => {
        return {
          ...response,
          data: response.data.map(item => ({
            ...item,
            key: item.avatarId,
            clanName: item.clan.name,
            maxLevel: item.variants.length,
          })),
        };
      },
      providesTags: ['Avatar'],
    }),

    updateAvatar: builder.mutation({
      query: ({ data, id }) => ({
        url: `/avatars/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Avatar'],
    }),

    deleteAvatar: builder.mutation({
      query: id => ({
        url: `avatars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Avatar'],
    }),

    avatarById: builder.query<Avatar, number>({
      query: id => ({ url: `/avatars/${id}`, method: 'GET' }),
    }),
  }),
});

export const {
  useAddAvatarMutation,
  useAllAvatarsQuery,
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
  useAvatarByIdQuery,
} = avatarSlice;
