'use client';

import React from 'react';

export interface Education {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string; // ISO string (YYYY-MM-DD)
    endDate: string; // ISO string or empty string for "present"
    isCurrent: boolean;
    description: string;
}

interface EducationTableProps {
    educations: Education[];
}

const EducationTable: React.FC<EducationTableProps> = ({ educations }) => {
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
                    {educations.map((edu) => (
                        <tr key={edu.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{edu.title}</td>
                            <td className="border px-4 py-2">{edu.company}</td>
                            <td className="border px-4 py-2">{edu.location}</td>
                            <td className="border px-4 py-2">
                                {edu.startDate}
                            </td>
                            <td className="border px-4 py-2">
                                {edu.endDate ? edu.endDate : 'Present'}
                            </td>
                            <td className="border px-4 py-2">
                                {edu.isCurrent ? 'Yes' : 'No'}
                            </td>
                            <td className="border px-4 py-2">
                                {edu.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EducationTable;
