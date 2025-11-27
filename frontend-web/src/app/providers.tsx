'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';
import { loadUserFromToken } from '@/features/auth/authSlice';

type Props = {
    children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
    const storeRef = useRef<AppStore>(undefined);
    if (!storeRef.current) {
        storeRef.current = makeStore();
        storeRef.current.dispatch(loadUserFromToken());
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
