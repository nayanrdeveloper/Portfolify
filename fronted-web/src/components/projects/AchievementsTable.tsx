'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import type { Achievement } from '@/redux/achievements/achievementTypes';

interface AchievementsTableProps {
    achievements: Achievement[];
    onDelete: (id: string) => void;
}

const AchievementsTable: React.FC<AchievementsTableProps> = ({
    achievements,
    onDelete,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">Issuer</th>
                        <th className="border px-4 py-2 text-left">
                            Issue Date
                        </th>
                        <th className="border px-4 py-2 text-left">
                            Expiration Date
                        </th>
                        <th className="border px-4 py-2 text-left">
                            Credential ID
                        </th>
                        <th className="border px-4 py-2 text-left">
                            Credential URL
                        </th>
                        <th className="border px-4 py-2 text-left">
                            Description
                        </th>
                        <th className="border px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {achievements.map((ach) => (
                        <tr key={ach._id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{ach.name}</td>
                            <td className="border px-4 py-2">{ach.issuer}</td>
                            <td className="border px-4 py-2">
                                {ach.issueDate}
                            </td>
                            <td className="border px-4 py-2">
                                {ach.expirationDate
                                    ? ach.expirationDate
                                    : 'N/A'}
                            </td>
                            <td className="border px-4 py-2">
                                {ach.credentialID}
                            </td>
                            <td className="border px-4 py-2">
                                <a
                                    href={ach.credentialURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View
                                </a>
                            </td>
                            <td className="border px-4 py-2">
                                {ach.description}
                            </td>
                            <td className="border px-4 py-2 flex space-x-2">
                                <Link href={`/admin/achievements/${ach._id}`}>
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
                                    onClick={() => onDelete(String(ach._id))}
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

export default AchievementsTable;
