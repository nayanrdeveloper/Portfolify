'use client';

import React from 'react';

const AchievementsTableShimmer: React.FC = () => {
    return (
        <div className="overflow-x-auto animate-pulse">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-200">
                    <tr>
                        {[
                            'Name',
                            'Issuer',
                            'Issue Date',
                            'Expiration Date',
                            'Credential ID',
                            'Credential URL',
                            'Description',
                            'Actions',
                        ].map((header, index) => (
                            <th
                                key={index}
                                className="border px-4 py-2 text-left"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array(3)
                        .fill(0)
                        .map((_, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {Array(8)
                                    .fill(0)
                                    .map((_, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="border px-4 py-2"
                                        >
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                        </td>
                                    ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default AchievementsTableShimmer;
