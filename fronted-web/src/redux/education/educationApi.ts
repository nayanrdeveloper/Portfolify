import { apiSlice } from '../apiSlice';
import {
    IEducationResponse,
    CreateEducationPayload,
    UpdateEducationPayload,
    Education,
} from './educationTypes';

export const educationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEducationByID: builder.query<Education, string>({
            query: (id) => ({
                url: `/educations/${id}`,
                method: 'GET',
            }),
            providesTags: ['Education'],
        }),
        getEducationsBySlug: builder.query<Education[], string>({
            query: (slug) => ({
                url: `/educations/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Education'],
        }),
        createEducation: builder.mutation<
            IEducationResponse,
            CreateEducationPayload
        >({
            query: (payload) => ({
                url: '/educations/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Education'],
        }),
        updateEducation: builder.mutation<
            IEducationResponse,
            UpdateEducationPayload
        >({
            query: ({ id, ...payload }) => ({
                url: `/educations/${id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Education'],
        }),
        deleteEducation: builder.mutation<IEducationResponse, string>({
            query: (id) => ({
                url: `/educations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Education'],
        }),
    }),
});

export const {
    useGetEducationByIDQuery,
    useGetEducationsBySlugQuery,
    useCreateEducationMutation,
    useUpdateEducationMutation,
    useDeleteEducationMutation,
} = educationApi;
