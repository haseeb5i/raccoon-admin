import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postSlice = createApi({
  reducerPath: 'postSlice',
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
  tagTypes: ['Post'],
  endpoints: builder => ({
    addPost: builder.mutation({
      query: data => ({
        url: '/posts/post',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Post'],
    }),

    allPosts: builder.query({
      query: ({ search }) => {
        const searchString = search || '';
        return {
          url: searchString === '' ? `/posts` : `/posts/filtered-posts/${searchString}`,
          method: 'GET',
        };
      },
      providesTags: ['Post'],
    }),

    updatePost: builder.mutation({
      query: ({ data, id }) => ({
        url: `/posts/post/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Post'],
    }),

    deletePost: builder.mutation({
      query: id => ({
        url: `posts/post/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),

    postById: builder.query({
      query: id => ({
        url: `/posts/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAddPostMutation,
  useAllPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  usePostByIdQuery,
} = postSlice;
