'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
    exp: number;
    // Add additional properties if needed
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.replace('/auth');
            return;
        }

        try {
            // Decode the token
            const decoded = jwtDecode<JWTPayload>(token);
            // Check expiration (exp is usually in seconds)
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('authToken');
                router.replace('/auth');
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('authToken');
            router.replace('/auth');
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        // Optionally show a spinner or loading state while checking
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return null; // Redirect is triggered, so nothing to render here.
    }

    return <>{children}</>;
}
