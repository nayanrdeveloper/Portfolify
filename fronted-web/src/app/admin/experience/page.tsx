'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';
import {
    useGetExperiencesBySlugQuery,
    useDeleteExperienceMutation,
} from '@/redux/experience/experienceApi';
import type { Experience } from '@/redux/experience/experienceTypes';
import ExperienceTable from '@/components/projects/ExperienceTable';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function ExperienceListPage() {
    const { slug } = useAppSelector((state) => state.auth.userProfile);

    const { data, isLoading, isError } = useGetExperiencesBySlugQuery(
        slug as string,
    );
    const [deleteExperience] = useDeleteExperienceMutation();

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteExperience(id).unwrap();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    if (isLoading) return <TableSkeleton columns={8} rows={4} />;
    if (isError || !data) return <div>Error loading experience records</div>;

    const experiences: Experience[] = Array.isArray(data) ? data : [];

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Experience</h1>
                <Link href="/admin/experience/new">
                    <Button variant="default">Add New Experience</Button>
                </Link>
            </div>
            <ExperienceTable
                experiences={experiences}
                onDelete={handleDelete}
            />
        </div>
    );
}
