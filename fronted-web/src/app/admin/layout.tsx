'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // note: import jwtDecode (not destructured)
import LayoutWrapper from '@/components/layouts/Sidebar/LayoutWrapper';
import { useAppDispatch } from '@/redux/hooks'; // your typed redux hooks
import { setUserProfile } from '@/redux/auth/authSlice'; // action to store user details
import AppLoader from '@/components/common/AppLoader';

interface JWTPayload {
    userId: string;
    email: string;
    slug: string;
    exp: number;
    iat: number;
    // add additional fields if needed
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.replace('/auth');
            return;
        }

        try {
            const decoded = jwtDecode<JWTPayload>(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('authToken');
                router.replace('/auth');
            } else {
                setIsAuthorized(true);
                dispatch(
                    setUserProfile({
                        userId: decoded.userId,
                        email: decoded.email,
                        slug: decoded.slug,
                    }),
                );
            }
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('authToken');
            router.replace('/auth');
        } finally {
            setLoading(false);
        }
    }, [router, dispatch]);

    if (loading) {
        return <AppLoader />;
    }

    if (!isAuthorized) {
        return null;
    }

    return <LayoutWrapper>{children}</LayoutWrapper>;
}
