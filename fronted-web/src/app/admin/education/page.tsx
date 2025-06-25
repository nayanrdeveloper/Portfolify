'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import {
    useGetEducationsBySlugQuery,
    useDeleteEducationMutation,
} from '@/redux/education/educationApi';
import type { Education } from '@/redux/education/educationTypes';
import { useAppSelector } from '@/redux/hooks';
import { formatDate } from '@/lib/dateUtils';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function EducationListPage() {
    const { slug } = useAppSelector((state) => state.auth.userProfile);
    const { data, isLoading, isError } = useGetEducationsBySlugQuery(
        slug as string,
    );
    const [deleteEducation, { isLoading: isDeleting }] =
        useDeleteEducationMutation();

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteEducation(id).unwrap();
                alert('Education deleted successfully');
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete education');
            }
        }
    };

    if (isLoading) return <TableSkeleton columns={8} rows={4} />;
    if (isError || !data) return <div>Error loading education records</div>;

    const educations: Education[] = Array.isArray(data) ? data : [];

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Education</h1>
                <Link href="/admin/education/new">
                    <Button variant="default">Add New Education</Button>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">
                                Institution
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Degree
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Field of Study
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Start Date
                            </th>
                            <th className="border px-4 py-2 text-left">
                                End Date
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Current
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Description
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {educations.map((edu) => (
                            <tr key={edu._id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">
                                    {edu.institution}
                                </td>
                                <td className="border px-4 py-2">
                                    {edu.degree}
                                </td>
                                <td className="border px-4 py-2">
                                    {edu.fieldOfStudy}
                                </td>
                                <td className="border px-4 py-2">
                                    {formatDate(edu.startDate)}
                                </td>
                                <td className="border px-4 py-2">
                                    {edu.endDate
                                        ? formatDate(edu.endDate)
                                        : 'Present'}
                                </td>
                                <td className="border px-4 py-2">
                                    {edu.isCurrent ? 'Yes' : 'No'}
                                </td>
                                <td className="border px-4 py-2">
                                    {edu.description}
                                </td>
                                <td className="border px-4 py-2 flex space-x-2">
                                    <Link href={`/admin/education/${edu._id}`}>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(String(edu._id))
                                        }
                                        disabled={isDeleting}
                                        className="flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
