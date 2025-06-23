// src/redux/projects/projectApi.ts
import { apiSlice } from '../apiSlice';
import {
    CreateProjectPayload,
    Project,
    UpdateProjectPayload,
} from './projectsTypes';

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjectByID: builder.query<Project, string>({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'GET',
            }),
            providesTags: ['Project'],
        }),
        getProjectsBySlug: builder.query<Project, string>({
            query: (slug) => ({
                url: `/projects/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Project'],
        }),
        createProject: builder.mutation<Project, CreateProjectPayload>({
            query: (project) => ({
                url: '/projects/',
                method: 'POST',
                body: project,
            }),
            invalidatesTags: ['Project'],
        }),
        updateProject: builder.mutation<Project, UpdateProjectPayload>({
            query: ({ id, ...project }) => ({
                url: `/projects/${id}`,
                method: 'PUT',
                body: project,
            }),
            invalidatesTags: ['Project'],
        }),
        deleteProject: builder.mutation<Project, string>({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Project'],
        }),
    }),
});

export const {
    useGetProjectByIDQuery,
    useGetProjectsBySlugQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectApi;
