import { apiSlice } from '../apiSlice';
import {
    ICategoryResponse,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from './categoryTypes';

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<ICategoryResponse, void>({
            query: () => ({
                url: '/categories/',
                method: 'GET',
            }),
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<
            ICategoryResponse,
            CreateCategoryPayload
        >({
            query: (payload) => ({
                url: '/categories',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation<
            ICategoryResponse,
            UpdateCategoryPayload
        >({
            query: ({ id, ...payload }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation<ICategoryResponse, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
