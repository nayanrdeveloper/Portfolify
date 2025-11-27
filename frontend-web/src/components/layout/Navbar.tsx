'use client';

import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/ui/button'; // Assuming shadcn button exists or I'll use standard HTML for now if not
import { LayoutDashboard } from 'lucide-react';

// I'll assume shadcn components are not fully set up yet, so I'll use raw tailwind classes for buttons to be safe, 
// or I can try to import from components/ui if I check they exist.
// User said "SHCDN UI" is set up.
// I'll check if components/ui exists.
// I saw "components.json" in root, so likely yes.
// But I didn't see "components/ui" in "src/components" listing earlier.
// "src/components" had 1 child.
// Let's check "src/components" again.

export default function Navbar() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>Portfolify</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Features
                    </Link>
                    <Link href="/#themes" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Themes
                    </Link>
                    <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Dashboard
                        </Link>
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
