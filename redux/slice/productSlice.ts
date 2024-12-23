import { FindAllParams, Paginated, Product, ProductWithKey } from '@/types/commonTypes';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type FindItemsParams = FindAllParams & { type?: string };

export const productSlice = createApi({
  reducerPath: 'productSlice',
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
  tagTypes: ['Product'],
  endpoints: builder => ({
    addProduct: builder.mutation({
      query: data => ({
        url: '/store',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    allProducts: builder.query<Paginated<ProductWithKey>, FindItemsParams>({
      query: ({ page = 1, limit = 10, type }) => ({
        url: '/store',
        params: { page, limit, type },
        method: 'GET',
      }),
      transformResponse: (response: Paginated<Product>) => {
        return {
          ...response,
          data: response.data.map(item => ({
            ...item,
            key: item.itemId,
            multiplier: item.arrow?.damageMulti || item.bow?.damageMulti || 'N/A',
            damage: item.arrow?.baseDamage ?? 'N/A',
          })),
        };
      },
      providesTags: ['Product'],
    }),

    updateProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `/store/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation({
      query: id => ({
        url: `store/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    productById: builder.query<Product, number>({
      query: id => ({ url: `/store/${id}`, method: 'GET' }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useProductByIdQuery,
} = productSlice;
