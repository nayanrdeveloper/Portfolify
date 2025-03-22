import { apiSlice } from '../apiSlice';
import { IUserDetailsResponse, UserDetailsInput } from './userdetailsTypes';

export const userDetailsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Public: Fetch user details by slug
        getUserDetailsBySlug: builder.query<IUserDetailsResponse, string>({
            query: (slug) => ({
                url: `/user-details/slug/${slug}`,
                method: 'GET',
            }),
            providesTags: ['UserDetails'],
        }),

        // Protected: Fetch your own details (requires auth)
        getMyUserDetails: builder.query<IUserDetailsResponse, void>({
            query: () => ({
                url: `/user-details/me`,
                method: 'GET',
            }),
            providesTags: ['UserDetails'],
        }),

        // Protected: Update your details (requires auth)
        updateMyUserDetails: builder.mutation<
            IUserDetailsResponse,
            UserDetailsInput
        >({
            query: (payload) => ({
                url: `/user-details/`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['UserDetails'],
        }),
    }),
});

export const {
    useGetUserDetailsBySlugQuery,
    useGetMyUserDetailsQuery,
    useUpdateMyUserDetailsMutation,
} = userDetailsApi;
