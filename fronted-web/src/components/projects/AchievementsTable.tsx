'use client';

import React from 'react';

export interface Achievement {
    id: number;
    name: string;
    issuer: string;
    issueDate: string; // ISO date string (YYYY-MM-DD)
    expirationDate: string; // ISO date string or empty for no expiration
    credentialId: string;
    credentialURL: string;
    description: string;
}

interface AchievementsTableProps {
    achievements: Achievement[];
}

const AchievementsTable: React.FC<AchievementsTableProps> = ({
    achievements,
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
                    </tr>
                </thead>
                <tbody>
                    {achievements.map((ach) => (
                        <tr key={ach.id} className="hover:bg-gray-50">
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
                                {ach.credentialId}
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AchievementsTable;
