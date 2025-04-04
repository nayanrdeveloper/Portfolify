import { apiSlice } from '../apiSlice';
import {
    IContactUsResponse,
    IContactUsMessagesResponse,
    ContactUsInput,
} from './contactusTypes';

export const contactusApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Public: Create a contact message using slug
        createContactMessage: builder.mutation<
            IContactUsResponse,
            ContactUsInput & { slug: string }
        >({
            query: ({ slug, ...body }) => ({
                url: `/contact/${slug}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ContactUs'],
        }),

        // Protected: Get all contact messages for the logged-in user
        getContactMessages: builder.query<IContactUsMessagesResponse, void>({
            query: () => ({
                url: `/contact/messages`,
                method: 'GET',
            }),
            providesTags: ['ContactUs'],
        }),

        // Protected: Get a specific contact message by ID
        getContactMessageByID: builder.query<IContactUsResponse, string>({
            query: (id) => ({
                url: `/contact/${id}`,
                method: 'GET',
            }),
            providesTags: ['ContactUs'],
        }),

        // Protected: Delete a contact message by ID
        deleteContactMessage: builder.mutation<IContactUsResponse, string>({
            query: (id) => ({
                url: `/contact/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ContactUs'],
        }),
    }),
});

export const {
    useCreateContactMessageMutation,
    useGetContactMessagesQuery,
    useGetContactMessageByIDQuery,
    useDeleteContactMessageMutation,
} = contactusApi;
