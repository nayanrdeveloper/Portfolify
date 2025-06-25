import { apiSlice } from '../apiSlice';
import {
    IExperienceResponse,
    CreateExperiencePayload,
    UpdateExperiencePayload,
    Experience,
} from './experienceTypes';

export const experienceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getExperienceByID: builder.query<Experience, string>({
            query: (id) => ({
                url: `/experiences/${id}`,
                method: 'GET',
            }),
            providesTags: ['Experience'],
        }),
        getExperiencesBySlug: builder.query<Experience, string>({
            query: (slug) => ({
                url: `/experiences/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Experience'],
        }),
        createExperience: builder.mutation<
            IExperienceResponse,
            CreateExperiencePayload
        >({
            query: (payload) => ({
                url: '/experiences/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Experience'],
        }),
        updateExperience: builder.mutation<Experience, UpdateExperiencePayload>(
            {
                query: ({ id, ...payload }) => ({
                    url: `/experiences/${id}`,
                    method: 'PUT',
                    body: payload,
                }),
                invalidatesTags: ['Experience'],
            },
        ),
        deleteExperience: builder.mutation<IExperienceResponse, string>({
            query: (id) => ({
                url: `/experiences/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Experience'],
        }),
    }),
});

export const {
    useGetExperienceByIDQuery,
    useGetExperiencesBySlugQuery,
    useCreateExperienceMutation,
    useUpdateExperienceMutation,
    useDeleteExperienceMutation,
} = experienceApi;
