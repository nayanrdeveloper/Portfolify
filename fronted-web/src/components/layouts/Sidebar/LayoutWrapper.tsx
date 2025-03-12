'use client';

import { useState } from 'react';
import MyNavBar from './MyNavBar';
import MySIdebar from './MySidebar';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    function handleToggleSidebar() {
        setIsSidebarOpen((prev) => !prev);
    }

    function handleCloseSidebar() {
        setIsSidebarOpen(false);
    }

    return (
        <div className="relative min-h-screen">
            <MyNavBar onToggleSidebar={handleToggleSidebar} />
            <MySIdebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
            <main
                className={`pt-16 transition-all duration-300 ${
                    isSidebarOpen ? 'ml-64' : 'ml-0'
                }`}
            >
                {children}
            </main>
        </div>
    );
}
