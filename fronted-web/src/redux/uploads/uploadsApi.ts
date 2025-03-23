import { apiSlice } from '../apiSlice';
import {
    SingleUploadResponse,
    MultipleUploadResponse,
    SingleUploadPayload,
    MultipleUploadPayload,
} from './uploadsTypes';

export const uploadsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Upload a single file
        uploadSingle: builder.mutation<
            SingleUploadResponse,
            SingleUploadPayload
        >({
            query: ({ file, folder }) => {
                const formData = new FormData();
                formData.append('file', file); // Must match "file" in the backend
                // If folder is provided, you can pass it as a query param or form field
                // but your backend code expects folder in the query string, e.g. ?folder=...
                // so we can handle that as a query param in the URL
                let url = '/uploads/single';
                if (folder) {
                    url += `?folder=${folder}`;
                }

                return {
                    url,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Upload'],
        }),

        // Upload multiple files
        uploadMultiple: builder.mutation<
            MultipleUploadResponse,
            MultipleUploadPayload
        >({
            query: ({ files, folder }) => {
                const formData = new FormData();
                // The backend code expects the form field name to be "files" (plural)
                files.forEach((file) => {
                    formData.append('files', file);
                });

                let url = '/uploads/multiple';
                if (folder) {
                    url += `?folder=${folder}`;
                }

                return {
                    url,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Upload'],
        }),
    }),
});

export const { useUploadSingleMutation, useUploadMultipleMutation } =
    uploadsApi;
