import { apiSlice } from '../apiSlice';
import { IUserDetailsResponse, UserDetailsInput } from './userdetailsTypes';

export const userDetailsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserDetailsBySlug: builder.query<IUserDetailsResponse, string>({
            query: (slug) => ({
                url: `/user-details/slug/${slug}`,
                method: 'GET',
                meta: {
                    skipSuccessToast: true,
                },
            }),
            providesTags: ['UserDetails'],
        }),

        getMyUserDetails: builder.query<IUserDetailsResponse, void>({
            query: () => ({
                url: `/user-details/me`,
                method: 'GET',
                meta: {
                    skipSuccessToast: true,
                },
            }),
            providesTags: ['UserDetails'],
        }),

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
