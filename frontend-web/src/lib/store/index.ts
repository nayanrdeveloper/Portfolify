import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import themeReducer from '../../features/theme/themeSlice';

export const makeStore = () =>
    configureStore({
        reducer: {
            auth: authReducer,
            theme: themeReducer,
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                serializableCheck: true,
            }),
        devTools: process.env.NODE_ENV !== 'production',
    });

// Singleton store for client-only usage (App Router typical pattern)
export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
