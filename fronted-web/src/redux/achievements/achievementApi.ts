// src/redux/achievements/achievementApi.ts

import { apiSlice } from '../apiSlice';
import {
    IAchievementResponse,
    CreateAchievementPayload,
    UpdateAchievementPayload,
    Achievement,
} from './achievementTypes';

export const achievementApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAchievementByID: builder.query<Achievement, string>({
            query: (id) => ({
                url: `/achievements/${id}`,
                method: 'GET',
            }),
            providesTags: ['Achievement'],
        }),
        getAchievementsBySlug: builder.query<Achievement[], string>({
            query: (slug) => ({
                url: `/achievements/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Achievement'],
        }),
        createAchievement: builder.mutation<
            IAchievementResponse,
            CreateAchievementPayload
        >({
            query: (payload) => ({
                url: '/achievements/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Achievement'],
        }),
        updateAchievement: builder.mutation<
            IAchievementResponse,
            UpdateAchievementPayload
        >({
            query: ({ id, ...payload }) => ({
                url: `/achievements/${id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Achievement'],
        }),
        deleteAchievement: builder.mutation<IAchievementResponse, string>({
            query: (id) => ({
                url: `/achievements/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Achievement'],
        }),
    }),
});

export const {
    useGetAchievementByIDQuery,
    useGetAchievementsBySlugQuery,
    useCreateAchievementMutation,
    useUpdateAchievementMutation,
    useDeleteAchievementMutation,
} = achievementApi;
