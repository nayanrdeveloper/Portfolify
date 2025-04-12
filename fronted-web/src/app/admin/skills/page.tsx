'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';
import {
    useGetSkillsBySlugQuery,
    useDeleteSkillMutation,
} from '@/redux/skills/skillApi';
import type { Skill } from '@/redux/skills/skillTypes';
import SkillsTable from '@/components/projects/SkillsTable';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function SkillsListPage() {
    // Get logged-in user's slug from Redux store
    const { slug } = useAppSelector((state) => state.auth.userProfile);
    const { data, isLoading, isError } = useGetSkillsBySlugQuery(
        slug as string,
    );
    const [deleteSkill] = useDeleteSkillMutation();

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this skill?')) {
            try {
                await deleteSkill(id).unwrap();
                // Optionally show a toast here
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    if (isLoading) return <TableSkeleton columns={8} rows={5} />;
    if (isError || !data) return <div>Error loading skills.</div>;

    const skills: Skill[] = Array.isArray(data.data) ? data.data : [];

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Skills</h1>
                <Link href="/admin/skills/new">
                    <Button variant="default">Add New Skill</Button>
                </Link>
            </div>
            <SkillsTable skills={skills} onDelete={handleDelete} />
        </div>
    );
}
