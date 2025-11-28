'use client';

import { Button } from '@/components/ui/button';
import { logoutUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>Portfolify</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/#features"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Features
                    </Link>
                    <Link
                        href="/#themes"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Themes
                    </Link>
                    <Link
                        href="/#pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                Dashboard
                            </Link>
                            <Button variant="ghost" onClick={handleLogout}>
                                Log out
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
