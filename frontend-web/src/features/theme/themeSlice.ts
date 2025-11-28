import api from '@/lib/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme, ThemeState } from './types';

const defaultThemes: Theme[] = [
    {
        id: 'standard',
        name: 'Standard',
        description: 'Fully customizable design.',
        thumbnailUrl: '/themes/standard.png',
        colors: {
            primary: '#000000',
            secondary: '#ffffff',
            background: '#ffffff',
            foreground: '#000000',
        },
        fontFamily: 'Inter',
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and minimalist design with bold typography.',
        thumbnailUrl: '/themes/modern.png',
        colors: {
            primary: '#0f172a',
            secondary: '#64748b',
            background: '#ffffff',
            foreground: '#0f172a',
        },
        fontFamily: 'Inter',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Traditional layout suitable for corporate profiles.',
        thumbnailUrl: '/themes/professional.png',
        colors: {
            primary: '#2563eb',
            secondary: '#475569',
            background: '#f8fafc',
            foreground: '#1e293b',
        },
        fontFamily: 'Roboto',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Vibrant colors and unique layout for creatives.',
        thumbnailUrl: '/themes/creative.png',
        colors: {
            primary: '#7c3aed',
            secondary: '#a78bfa',
            background: '#faf5ff',
            foreground: '#4c1d95',
        },
        fontFamily: 'Outfit',
    },
];

const initialState: ThemeState = {
    currentThemeId: 'standard',
    customizations: {},
    availableThemes: defaultThemes,
    isLoading: false,
    error: null,
};

export const fetchThemeSettings = createAsyncThunk(
    'theme/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/settings');
            return response.data;
        } catch (error: any) {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
        }
    },
);

export const saveThemeSettings = createAsyncThunk(
    'theme/saveSettings',
    async (
        data: { template: string; customization?: { primaryColor?: string; fontFamily?: string } },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.put('/settings', data);
            return response.data;
        } catch (error: any) {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            return rejectWithValue(error.response?.data?.message || 'Failed to save settings');
        }
    },
);

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            state.currentThemeId = action.payload;
        },
        updateCustomization: (
            state,
            action: PayloadAction<{ primaryColor?: string; fontFamily?: string }>,
        ) => {
            state.customizations = { ...state.customizations, ...action.payload };
            // Automatically switch to standard if customizing
            if (state.currentThemeId !== 'standard') {
                state.currentThemeId = 'standard';
            }
        },
        resetCustomization: state => {
            state.customizations = {};
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchThemeSettings.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchThemeSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.currentThemeId = action.payload.template || 'standard';
                    state.customizations = action.payload.customization || {};
                }
            })
            .addCase(fetchThemeSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(saveThemeSettings.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(saveThemeSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.currentThemeId = action.payload.template;
                    state.customizations = action.payload.customization || {};
                }
            })
            .addCase(saveThemeSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setTheme, updateCustomization, resetCustomization } = themeSlice.actions;
export default themeSlice.reducer;
