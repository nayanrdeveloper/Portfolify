'use client';

import React from 'react';

export interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string; // ISO date string (YYYY-MM-DD)
    endDate: string; // ISO date string or empty string if currently active
    isCurrent: boolean;
    description: string;
}

interface ExperienceTableProps {
    experiences: Experience[];
}

const ExperienceTable: React.FC<ExperienceTableProps> = ({ experiences }) => {
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
                    </tr>
                </thead>
                <tbody>
                    {experiences.map((exp) => (
                        <tr key={exp.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{exp.title}</td>
                            <td className="border px-4 py-2">{exp.company}</td>
                            <td className="border px-4 py-2">{exp.location}</td>
                            <td className="border px-4 py-2">
                                {exp.startDate}
                            </td>
                            <td className="border px-4 py-2">
                                {exp.endDate ? exp.endDate : 'Present'}
                            </td>
                            <td className="border px-4 py-2">
                                {exp.isCurrent ? 'Yes' : 'No'}
                            </td>
                            <td className="border px-4 py-2">
                                {exp.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExperienceTable;
