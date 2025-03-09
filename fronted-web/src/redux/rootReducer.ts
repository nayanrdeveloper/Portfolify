import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './auth/authSlice';

export const rootReducer = combineReducers({
    auth: authReducer, // if you use the authSlice
    [apiSlice.reducerPath]: apiSlice.reducer,
});
