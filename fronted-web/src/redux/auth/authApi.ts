import { apiSlice } from '../apiSlice';

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

export interface ILoginResponse {
    token: string;
}

export interface IRegisterResponse {
    user: IUser;
    token: string;
}

export interface IUser {
    fullName: string;
    email: string;
    slug: string;
}

/* ---------- RTK Query endpoints ---------- */
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /* LOGIN — returns bare token string to the caller */
        login: builder.mutation<ILoginResponse, LoginPayload>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
                meta: { successMessage: 'You have logged in successfully!' },
            }),

            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('authToken', data.token);
                } catch {
                    /* toast already handled */
                }
            },
        }),

        register: builder.mutation<IRegisterResponse, RegisterPayload>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
                meta: { successMessage: 'You have registered successfully!' },
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
