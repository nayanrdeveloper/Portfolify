'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
    onToggleSidebar: () => void;
}

export default function MyNavBar({ onToggleSidebar }: NavbarProps) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/auth');
    };

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow z-50 flex items-center px-4">
            {/* Left side: Hamburger & Logo */}
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    onClick={onToggleSidebar}
                    className="p-2"
                >
                    <Menu className="w-5 h-5" />
                </Button>
                <Link href="/">
                    <span className="text-lg font-bold">My Logo</span>
                </Link>
            </div>

            {/* Right side: User icon with dropdown */}
            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-2">
                            <User className="w-5 h-5" />
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
}
