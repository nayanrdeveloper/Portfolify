import { fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import toast from 'react-hot-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<DataType = any> {
    status: string; // "success" or "error"
    message?: string;
    data?: DataType;
    error?: string;
}

/**
 * Optional: We'll allow each endpoint to pass custom "meta" settings.
 * For example, meta: { successMessage: "Overridden success message" }
 */
interface CustomMeta {
    successMessage?: string;
    errorMessage?: string;
    skipSuccessToast?: boolean;
    skipErrorToast?: boolean;
}

type CustomBaseQueryArgs = {
    url: string;
    method?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>;
    meta?: CustomMeta;
};

// Configure fetchBaseQuery with a base URL and reading token from localStorage
const rawBaseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    // Remove credentials since we use localStorage for the token
    // credentials: "include",
    prepareHeaders: (headers) => {
        // Check if window is available (client-side only)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }
        return headers;
    },
});

/**
 * A custom base query that intercepts and shows toast messages
 * for success/error based on the "status" field in the server response.
 */
export const baseQueryWithInterceptor: BaseQueryFn<
    CustomBaseQueryArgs,
    unknown,
    unknown
> = async (args, api, extraOptions) => {
    // Extract optional meta fields
    const { meta, ...baseQueryArgs } = args;

    // Execute the base query
    const result = await rawBaseQuery(baseQueryArgs, api, extraOptions);

    // If fetchBaseQuery returned an error (network/server error: 4xx, 5xx)
    if (result.error) {
        const fetchError = result.error as FetchBaseQueryError & {
            data?: CommonResponse;
        };
        const serverData = fetchError?.data;

        if (!meta?.skipErrorToast) {
            toast.error(
                meta?.errorMessage ||
                    serverData?.message ||
                    'An unexpected error occurred.',
            );
        }

        return { error: result.error };
    }

    // Otherwise, we have a 2xx HTTP status.
    // Check if the response body's status field equals "success"
    const data = result.data as CommonResponse;
    if (data.status !== 'success') {
        if (!meta?.skipErrorToast) {
            toast.error(
                meta?.errorMessage ||
                    data.message ||
                    'An unexpected error occurred.',
            );
        }

        return {
            error: {
                status: 'CUSTOM_ERROR',
                data,
            },
        };
    }

    // If success=true, optionally show a success toast
    if (!meta?.skipSuccessToast) {
        const successMsg = meta?.successMessage || data.message;
        if (successMsg) {
            toast.success(successMsg);
        }
    }

    return { data };
};
