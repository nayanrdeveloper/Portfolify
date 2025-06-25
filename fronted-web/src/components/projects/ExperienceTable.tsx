'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import type { Experience } from '@/redux/experience/experienceTypes';
import { formatDate } from '@/lib/dateUtils';

interface ExperienceTableProps {
    experiences: Experience[];
    onDelete: (id: string) => void;
}

const ExperienceTable: React.FC<ExperienceTableProps> = ({
    experiences,
    onDelete,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Title</th>
                        <th className="border px-4 py-2 text-left">Company</th>
                        <th className="border px-4 py-2 text-left">Location</th>
                        <th className="border px-4 py-2 text-left">
                            Start Date
                        </th>
                        <th className="border px-4 py-2 text-left">End Date</th>
                        <th className="border px-4 py-2 text-left">Current</th>
                        <th className="border px-4 py-2 text-left">
                            Description
                        </th>
                        <th className="border px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {experiences.map((exp) => (
                        <tr key={exp._id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{exp.title}</td>
                            <td className="border px-4 py-2">{exp.company}</td>
                            <td className="border px-4 py-2">{exp.location}</td>
                            <td className="border px-4 py-2">
                                {formatDate(exp.startDate)}
                            </td>
                            <td className="border px-4 py-2">
                                {exp.endDate
                                    ? formatDate(exp.endDate)
                                    : 'Present'}
                            </td>
                            <td className="border px-4 py-2">
                                {exp.isCurrent ? 'Yes' : 'No'}
                            </td>
                            <td className="border px-4 py-2">
                                {exp.description}
                            </td>
                            <td className="border px-4 py-2 flex space-x-2">
                                <Link href={`/admin/experience/${exp._id}`}>
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
                                    onClick={() => onDelete(String(exp._id))}
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
    );
};

export default ExperienceTable;
