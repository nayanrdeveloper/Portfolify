'use client';

import Link from 'next/link';
import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/auth');
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow ml-64">
            <div className="">
                <Link href="/">
                    <span className="text-2xl font-bold">MyLogo</span>
                </Link>
            </div>
            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-2">
                            <User className="w-6 h-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem
                            onClick={() => router.push('/settings')}
                        >
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default Navbar;
