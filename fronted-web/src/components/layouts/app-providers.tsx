// src/providers/app-providers.tsx (or app/providers.tsx in Next.js)
'use client';

import { store } from '@/redux/store';
import React, { FC, ReactNode } from 'react';

// Redux
import { Provider as ReduxProvider } from 'react-redux';

interface AppProvidersProps {
    children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
