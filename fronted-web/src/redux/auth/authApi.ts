import { apiSlice } from '../apiSlice';

// ---- TYPES ----
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    success: boolean;
    data: {
        token: string;
    };
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
    slug: string;
}

export interface RegisterResponse {
    status: string;
    message: string;
    data: {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        email: string;
        slug: string;
    };
}

// ---- RTK QUERY ----
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginPayload>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
                meta: { successMessage: 'You have logged in successfully!' },
            }),
            async onQueryStarted(args, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.success) {
                        await localStorage.setItem(
                            'authToken',
                            data.data.token,
                        );
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
                meta: { successMessage: 'You have registered successfully!' },
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
