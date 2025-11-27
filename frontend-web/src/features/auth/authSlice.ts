import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';
import { AuthState, LoginResponse, RegisterResponse, User } from './types';
import { jwtDecode } from 'jwt-decode';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    slug?: string;
}

interface DecodedToken {
    userId: string;
    email: string;
    slug: string;
    exp: number;
}

// Initial state
const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterPayload, { rejectWithValue }) => {
        try {
            const response = await api.post<RegisterResponse>('/auth/register', data);
            localStorage.setItem('token', response.data.data.token);
            return response.data.data;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = error as any;
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', data);
            localStorage.setItem('token', response.data.data.token);
            return response.data.data;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = error as any;
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loadUserFromToken: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    // Check if token is expired
                    if (decoded.exp * 1000 < Date.now()) {
                        localStorage.removeItem('token');
                        state.token = null;
                        state.user = null;
                        state.isAuthenticated = false;
                    } else {
                        state.token = token;
                        state.isAuthenticated = true;
                        state.user = {
                            _id: decoded.userId,
                            email: decoded.email,
                            slug: decoded.slug,
                            fullName: '', // Not in token
                            createdAt: '', // Not in token
                        };
                    }
                } catch {
                    localStorage.removeItem('token');
                    state.token = null;
                    state.user = null;
                    state.isAuthenticated = false;
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            // Decode token to get user info since login doesn't return user object
            const decoded = jwtDecode<DecodedToken>(action.payload.token);
            state.user = {
                _id: decoded.userId,
                email: decoded.email,
                slug: decoded.slug,
                fullName: '',
                createdAt: '',
            };
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        });
    },
});

export const { loadUserFromToken } = authSlice.actions;
export default authSlice.reducer;
