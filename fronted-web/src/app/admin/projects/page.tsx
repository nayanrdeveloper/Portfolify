// app/projects/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProjectsTable from '@/components/layouts/Navbar/ProjectsTable';

export default function ProjectsPage() {
    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Link href="/admin/projects/new">
                    <Button variant="default">Create New Project</Button>
                </Link>
            </div>
            <ProjectsTable />
        </div>
    );
}
