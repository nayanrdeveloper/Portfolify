import { apiSlice } from '../apiSlice';
import { SingleUploadPayload, MultipleUploadPayload } from './uploadsTypes';

export const uploadsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /* ---------- SINGLE ---------- */
        uploadSingle: builder.mutation<string, SingleUploadPayload>({
            query: ({ file, folder }) => {
                const formData = new FormData();
                formData.append('file', file);

                let url = '/uploads/single';
                if (folder) url += `?folder=${folder}`;

                return { url, method: 'POST', body: formData };
            },

            // ✅ resp is { secureUrl: '...' }
            transformResponse: (resp: { secureUrl: string }) => resp.secureUrl,

            invalidatesTags: ['Upload'],
        }),

        /* ---------- MULTIPLE -------- */
        uploadMultiple: builder.mutation<string[], MultipleUploadPayload>({
            query: ({ files, folder }) => {
                const formData = new FormData();
                files.forEach((f) => formData.append('files', f));

                let url = '/uploads/multiple';
                if (folder) url += `?folder=${folder}`;

                return { url, method: 'POST', body: formData };
            },

            // ✅ resp is { secureUrls: [...] }
            transformResponse: (resp: { secureUrls: string[] }) =>
                resp.secureUrls,

            invalidatesTags: ['Upload'],
        }),
    }),
});

export const { useUploadSingleMutation, useUploadMultipleMutation } =
    uploadsApi;
