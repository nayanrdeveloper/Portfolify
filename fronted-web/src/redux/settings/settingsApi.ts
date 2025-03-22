import { apiSlice } from '../apiSlice';

// Types for Settings API
export interface ISettingsResponse {
    template: string;
}

export interface UpdateSettingsPayload {
    id: string;
    template: string;
}

export const settingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ✅ Get user settings by slug (PUBLIC endpoint, no auth required)
        getUserSettingsBySlug: builder.query<ISettingsResponse, string>({
            query: (slug) => ({
                url: `/settings/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),

        // ✅ Get settings by user ID (PRIVATE, requires auth)
        getUserSettingsByID: builder.query<ISettingsResponse, string>({
            query: (id) => ({
                url: `/settings/${id}`,
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),

        // ✅ Update user settings (PRIVATE, requires auth)
        updateUserSettings: builder.mutation<
            ISettingsResponse,
            UpdateSettingsPayload
        >({
            query: ({ id, ...payload }) => ({
                url: `/settings/${id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetUserSettingsBySlugQuery,
    useGetUserSettingsByIDQuery,
    useUpdateUserSettingsMutation,
} = settingsApi;
