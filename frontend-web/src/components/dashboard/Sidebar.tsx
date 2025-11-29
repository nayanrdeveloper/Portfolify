'use client';

import { logoutUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/lib/store/hooks';
import { cn } from '@/lib/utils';
import {
    Award,
    BarChart3,
    Briefcase,
    FileText,
    FolderKanban,
    Image as ImageIcon,
    LayoutDashboard,
    MessageSquare,
    LogOut,
    Palette,
    Settings,
    UploadCloud,
    UserCircle,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Skills', href: '/dashboard/skills', icon: Zap },
    { name: 'Experience', href: '/dashboard/experience', icon: Briefcase },
    { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare }, // Added Messages link
    { name: 'Themes', href: '/dashboard/themes', icon: Palette },
    { name: 'Media Library', href: '/dashboard/media', icon: ImageIcon },
    { name: 'Publish', href: '/dashboard/publish', icon: UploadCloud },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Articles', href: '/dashboard/articles', icon: FileText }, // Added Articles link
    { name: 'Account', href: '/dashboard/account', icon: UserCircle },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push('/login');
    };

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="p-6">
                <Link href="/dashboard">
                    <Image
                        src="/logo.png"
                        alt="Portfolify"
                        width={140}
                        height={40}
                        className="h-8 w-auto"
                        priority
                    />
                </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3">
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-3 border-t">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </button>
            </div>
        </div>
    );
}
