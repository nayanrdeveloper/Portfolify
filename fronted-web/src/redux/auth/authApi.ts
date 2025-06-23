import { apiSlice } from '../apiSlice';

/* ---------- shared envelope ---------- */
interface ApiEnvelope<Data = unknown> {
    message?: string;
    data: Data; // always present on success
}

/* ---------- payload models ---------- */
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    fullName: string;
    slug: string;
}

/* ---------- responses ---------- */
type RegisterSuccess = ApiEnvelope<{
    id: string;
    createdAt: string;
    updatedAt: string;
    fullName: string;
    email: string;
    slug: string;
}>;

/* ---------- RTK Query endpoints ---------- */
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /* LOGIN — returns bare token string to the caller */
        login: builder.mutation<string, LoginPayload>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
                meta: { successMessage: 'You have logged in successfully!' },
            }),

            // baseQuery returns { token }  →  expose the string
            transformResponse: (resp: { token: string }) => resp.token,

            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data: token } = await queryFulfilled;
                    localStorage.setItem('authToken', token);
                } catch {
                    /* toast already handled */
                }
            },
        }),

        /* REGISTER — returns created user object */
        register: builder.mutation<RegisterSuccess['data'], RegisterPayload>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
                meta: { successMessage: 'You have registered successfully!' },
            }),
            transformResponse: (resp: RegisterSuccess) => resp.data,
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
