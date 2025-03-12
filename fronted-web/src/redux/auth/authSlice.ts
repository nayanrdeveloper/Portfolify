// src/redux/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    userProfile: {
        email: string;
        userId: string;
        slug: string;
    };
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    userProfile: {
        email: '',
        slug: '',
        userId: '',
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        setUserProfile(
            state,
            action: PayloadAction<{
                email: string;
                userId: string;
                slug: string;
            }>,
        ) {
            state.userProfile = action.payload;
        },
        clearAuthToken(state) {
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setAuthToken, setUserProfile, clearAuthToken } =
    authSlice.actions;
export default authSlice.reducer;
