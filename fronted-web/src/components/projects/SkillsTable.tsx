'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Progress } from '@/components/ui/progress'; // shadcn/ui Progress component
import type { Skill } from '@/redux/skills/skillTypes';

interface SkillsTableProps {
    skills: Skill[];
    onDelete: (id: string) => void;
}

const SkillsTable: React.FC<SkillsTableProps> = ({ skills, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">
                            Proficiency
                        </th>
                        <th className="border px-4 py-2 text-left">Years</th>
                        <th className="border px-4 py-2 text-left">Progress</th>
                        <th className="border px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill) => (
                        <tr key={skill.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{skill.name}</td>
                            <td className="border px-4 py-2">
                                {skill.proficiency}
                            </td>
                            <td className="border px-4 py-2">{skill.years}</td>
                            <td className="border px-4 py-2">
                                <Progress
                                    value={skill.progress}
                                    className="w-32"
                                />
                            </td>
                            <td className="border px-4 py-2 flex space-x-2">
                                <Link href={`/admin/skills/${skill.id}`}>
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
                                    onClick={() => onDelete(String(skill.id))}
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

export default SkillsTable;
