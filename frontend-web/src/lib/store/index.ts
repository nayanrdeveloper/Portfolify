// src/lib/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../../features/products/productsSlice';
// import cartReducer from '../features/cart/cartSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
    //   cart: cartReducer,
    },
    // You can tweak middleware here if needed
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Example: if you use non-serializable data, turn this off or customize
        serializableCheck: true,
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

// Singleton store for client-only usage (App Router typical pattern)
export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
