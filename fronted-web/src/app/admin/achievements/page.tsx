'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetAchievementsBySlugQuery } from '@/redux/achievements/achievementApi';
import { useAppSelector } from '@/redux/hooks';
import type { Achievement } from '@/redux/achievements/achievementTypes';
import AchievementsTable from '@/components/projects/AchievementsTable';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function AchievementsListPage() {
    const { slug } = useAppSelector((state) => state.auth.userProfile);
    const { data, isLoading, isError } = useGetAchievementsBySlugQuery(
        slug as string,
    );

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this record?')) {
            try {
                console.log('Delete achievement with id:', id);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    if (isLoading) return <TableSkeleton columns={8} rows={4} />;
    if (isError || !data) return <div>Error loading achievements.</div>;

    const achievements: Achievement[] = Array.isArray(data) ? data : [];

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Achievements</h1>
                <Link href="/admin/achievements/new">
                    <Button variant="default">Add New Achievement</Button>
                </Link>
            </div>
            <AchievementsTable
                achievements={achievements}
                onDelete={handleDelete}
            />
        </div>
    );
}
