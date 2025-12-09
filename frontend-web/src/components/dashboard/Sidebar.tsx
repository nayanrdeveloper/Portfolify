'use client';

import { logoutUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/lib/store/hooks';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Award,
    BarChart3,
    Briefcase,
    ChevronRight,
    FileText,
    FolderKanban,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Palette,
    Settings,
    UploadCloud,
    UserCircle,
    Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
};

type NavGroup = {
    label: string;
    items: NavItem[];
};

const navGroups: NavGroup[] = [
    {
        label: 'Platform',
        items: [
            { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
            { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
        ],
    },
    {
        label: 'Content',
        items: [
            { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
            { name: 'Skills', href: '/dashboard/skills', icon: Zap },
            { name: 'Experience', href: '/dashboard/experience', icon: Briefcase },
            { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
            { name: 'Articles', href: '/dashboard/articles', icon: FileText },
            { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
        ],
    },
    {
        label: 'Design',
        items: [
            { name: 'Themes', href: '/dashboard/themes', icon: Palette },
            { name: 'Resume', href: '/dashboard/resume', icon: FileText },
        ],
    },
    {
        label: 'Settings',
        items: [
            { name: 'Publish', href: '/dashboard/publish', icon: UploadCloud },
            { name: 'Account', href: '/dashboard/account', icon: UserCircle },
            { name: 'Settings', href: '/dashboard/settings', icon: Settings },
        ],
    },
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
        <div className="flex h-full w-72 flex-col border-r bg-card/50 backdrop-blur-xl">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg opacity-20 blur-sm" />
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Portfolify
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth">
                {navGroups.map((group, groupIndex) => (
                    <div key={group.label} className="mb-6">
                        <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {group.label}
                        </h4>
                        <div className="space-y-1">
                            {group.items.map(item => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                                : 'text-muted-foreground hover:bg-purple-500/10 hover:text-purple-600'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon
                                                className={cn(
                                                    'h-4 w-4 transition-transform group-hover:scale-110',
                                                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-purple-600'
                                                )}
                                            />
                                            {item.name}
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="h-1.5 w-1.5 rounded-full bg-white"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t bg-black/5">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-600"
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Log out
                </button>
            </div>
        </div>
    );
}
