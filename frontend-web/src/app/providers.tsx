'use client';

import { loadUserFromToken } from '@/features/auth/authSlice';
import { AppStore, makeStore } from '@/lib/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

type Props = {
    children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
    const storeRef = useRef<AppStore>(undefined);
    if (!storeRef.current) {
        storeRef.current = makeStore();
        if (typeof window !== 'undefined') {
            storeRef.current.dispatch(loadUserFromToken());
        }
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
