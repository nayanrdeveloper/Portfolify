import { apiSlice } from '../apiSlice';

// Types for Settings API
export interface ISettingsResponse {
    status: string; // "success" or "error"
    message: string;
    data: {
        template: string;
    };
}

export interface ISettings {
    template: string;
}

export interface UpdateSettingsPayload {
    id: string;
    template: string;
}

export const settingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ✅ Get user settings by slug (PUBLIC endpoint, no auth required)
        getUserSettingsBySlug: builder.query<ISettings, string>({
            query: (slug) => ({
                url: `/settings/user/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),

        // ✅ Get settings by user ID (PRIVATE, requires auth)
        getUserSettingsByID: builder.query<ISettings, string>({
            query: (id) => ({
                url: `/settings/${id}`,
                method: 'GET',
            }),
            providesTags: ['Settings'],
        }),

        updateUserSettings: builder.mutation<
            ISettingsResponse,
            UpdateSettingsPayload
        >({
            query: ({ ...payload }) => ({
                url: `/settings/`,
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
