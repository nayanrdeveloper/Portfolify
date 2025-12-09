'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAppSelector } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background relative selection:bg-primary/20">
            {/* Global Dashboard Background Gradients */}
            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative z-10">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto bg-muted/10 p-6 md:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}
