import { apiSlice } from '../apiSlice';
import {
    ISkillResponse,
    CreateSkillPayload,
    UpdateSkillPayload,
} from './skillTypes';

export const skillApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSkillsBySlug: builder.query<ISkillResponse, string>({
            query: (slug) => ({
                url: `/skills/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Skill'],
        }),
        getSkillByID: builder.query<ISkillResponse, string>({
            query: (id) => ({
                url: `/skills/${id}`,
                method: 'GET',
            }),
            providesTags: ['Skill'],
        }),
        createSkill: builder.mutation<ISkillResponse, CreateSkillPayload>({
            query: (payload) => ({
                url: '/skills/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Skill'],
        }),
        updateSkill: builder.mutation<ISkillResponse, UpdateSkillPayload>({
            query: ({ id, ...payload }) => ({
                url: `/skills/${id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Skill'],
        }),
        deleteSkill: builder.mutation<ISkillResponse, string>({
            query: (id) => ({
                url: `/skills/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Skill'],
        }),
    }),
});

export const {
    useGetSkillsBySlugQuery,
    useGetSkillByIDQuery,
    useCreateSkillMutation,
    useUpdateSkillMutation,
    useDeleteSkillMutation,
} = skillApi;
