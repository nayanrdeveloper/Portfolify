import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductsState } from './types';

const initialState: ProductsState = {
  items: [
    {
      id: '1',
      name: 'Product 1',
      price: 10,
    },
    {
      id: '2',
      name: 'Product 2',
      price: 20,
    },
    {
      id: '3',
      name: 'Product 3',
      price: 30,
    },
  ],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productsLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    productsLoaded(state, action: PayloadAction<Product[]>) {
      state.status = 'succeeded';
      state.items = action.payload;
    },
    productsFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  productsLoading,
  productsLoaded,
  productsFailed,
  addProduct,
  updateProduct,
  removeProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
