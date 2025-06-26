'use client';

import { cn } from '@/lib/utils';
import {
    Calendar,
    Inbox,
    // LucideDownloadCloud,
    Settings,
    Building,
    Award,
    Projector,
    User,
    RadioTowerIcon,
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidebarList = [
    {
        title: 'User Details',
        icon: User,
        route: '/admin',
    },
    {
        title: 'Projects',
        icon: Calendar,
        route: '/admin/projects',
    },
    {
        title: 'Social Media',
        icon: RadioTowerIcon,
        route: '/admin/social-media',
    },
    {
        title: 'Experience',
        icon: Inbox,
        route: '/admin/experience',
    },
    {
        title: 'Settings',
        icon: Settings,
        route: '/admin/settings',
    },
    // {
    //     title: 'Skills',
    //     icon: LucideDownloadCloud,
    //     route: '/admin/skills',
    // },
    {
        title: 'Education',
        icon: Building,
        route: '/admin/education',
    },
    {
        title: 'experience',
        icon: Projector,
        route: '/admin/experience',
    },
    {
        title: 'Achievements',
        icon: Award,
        route: '/admin/achievements',
    },
    {
        title: 'Contact Messages',
        icon: Inbox,
        route: '/admin/contact-messages',
    },
];

export default function MySIdebar({ isOpen }: SidebarProps) {
    return (
        <aside
            className={cn(
                'fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r shadow transition-transform duration-300 z-40',
                isOpen ? 'translate-x-0' : '-translate-x-64',
            )}
        >
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Sidebar</h2>
            </div>
            <nav className="mt-4">
                <ul className="">
                    {SidebarList.map((sidebarItem, index) => {
                        return (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex space-x-2"
                            >
                                <Link
                                    href={sidebarItem.route}
                                    className="flex items-center space-x-2 w-full"
                                >
                                    <sidebarItem.icon />
                                    <span>{sidebarItem.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
