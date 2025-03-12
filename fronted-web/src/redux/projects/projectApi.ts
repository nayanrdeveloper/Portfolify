// src/redux/projects/projectApi.ts
import { apiSlice } from '../apiSlice';
import {
    IProjectResponse,
    CreateProjectPayload,
    UpdateProjectPayload,
} from './projectsTypes';

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjectByID: builder.query<IProjectResponse, string>({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'GET',
            }),
            providesTags: ['Project'],
        }),
        getProjectsBySlug: builder.query<IProjectResponse, string>({
            query: (slug) => ({
                url: `/projects/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Project'],
        }),
        createProject: builder.mutation<IProjectResponse, CreateProjectPayload>(
            {
                query: (project) => ({
                    url: '/projects/',
                    method: 'POST',
                    body: project,
                }),
                invalidatesTags: ['Project'],
            },
        ),
        updateProject: builder.mutation<IProjectResponse, UpdateProjectPayload>(
            {
                query: ({ id, ...project }) => ({
                    url: `/projects/${id}`,
                    method: 'PUT',
                    body: project,
                }),
                invalidatesTags: ['Project'],
            },
        ),
        deleteProject: builder.mutation<IProjectResponse, string>({
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
