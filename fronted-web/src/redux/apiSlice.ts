import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithInterceptor } from './customBaseQuery';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithInterceptor,
    tagTypes: [
        'Project',
        'Education',
        'Experience',
        'Achievement',
        'Skill',
        'Category',
        'Settings',
        'UserDetails',
        'Upload',
        'ContactUs',
        'SocialMedia',
    ],
    endpoints: () => ({}),
});
