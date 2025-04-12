import { apiSlice } from '../apiSlice';
import { ISocialMediaResponse, SocialMediaInput } from './socialMediaTypes';

export const socialMediaApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSocialMediaBySlug: builder.query<ISocialMediaResponse, string>({
            query: (slug) => ({
                url: `/socialmedia/user/${slug}`,
                method: 'GET',
                meta: { skipSuccessToast: true },
            }),
            providesTags: ['SocialMedia'],
        }),

        updateSocialMedia: builder.mutation<
            ISocialMediaResponse,
            SocialMediaInput
        >({
            query: (payload) => ({
                url: '/socialmedia/',
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['SocialMedia'],
        }),
    }),
});

export const { useGetSocialMediaBySlugQuery, useUpdateSocialMediaMutation } =
    socialMediaApi;
