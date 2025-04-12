import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './auth/authSlice';
import userDetailsReducer from './userdetails/userDetailsSlice';
import socialMediaReducer from './socialMedia/socialMediaSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    userDetails: userDetailsReducer,
    socialMedia: socialMediaReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});
