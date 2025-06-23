import { fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import toast from 'react-hot-toast';

/* ---------- response shapes ---------- */
interface ApiSuccess<Data = unknown> {
    message?: string;
    data?: Data;
}
interface ApiError {
    message?: string;
}

/* ---------- per-endpoint meta ---------- */
interface CustomMeta {
    successMessage?: string;
    errorMessage?: string;
    skipSuccessToast?: boolean;
    skipErrorToast?: boolean;
}

type CustomBaseQueryArgs = {
    url: string;
    method?: string;
    body?: unknown;
    params?: Record<string, unknown>;
    meta?: CustomMeta;
};

/* ---------- baseURL for Next ---------- */
const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    // credentials: 'include',           // ← enable only if you use cookies
    prepareHeaders: (headers) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

/* ---------- custom baseQuery ---------- */
export const baseQueryWithInterceptor: BaseQueryFn<
    CustomBaseQueryArgs,
    unknown,
    unknown
> = async (args, api, extraOptions) => {
    const { meta, ...baseArgs } = args;

    const result = await rawBaseQuery(baseArgs, api, extraOptions);

    /* –– 4xx / 5xx errors –– */
    if (result.error) {
        const err = result.error as FetchBaseQueryError & { data?: ApiError };

        if (!meta?.skipErrorToast) {
            const msg =
                meta?.errorMessage ||
                err.data?.message ||
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore — `error` exists on one union branch
                ('error' in err ? err.error : undefined) ||
                'Request failed';
            toast.error(msg);
        }
        return { error: result.error };
    }

    /* –– 2xx success –– */
    const payload = result.data as ApiSuccess;

    if (!meta?.skipSuccessToast && payload.message) {
        toast.success(meta?.successMessage ?? payload.message);
    }

    /* return `data` if present, otherwise whole payload */
    return { data: payload.data ?? payload };
};
