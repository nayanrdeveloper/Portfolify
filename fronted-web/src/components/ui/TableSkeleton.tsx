'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
    /**
     * Number of rows to display. Default is 3.
     */
    rows?: number;
    /**
     * Number of columns to display. Default is 5.
     */
    columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 3,
    columns = 5,
}) => {
    const rowArray = Array.from({ length: rows });
    const colArray = Array.from({ length: columns });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-200">
                    <tr>
                        {colArray.map((_, index) => (
                            <th
                                key={index}
                                className="border px-4 py-2 text-left"
                            >
                                <Skeleton className="h-4 w-full" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rowArray.map((_, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {colArray.map((_, colIndex) => (
                                <td key={colIndex} className="border px-4 py-2">
                                    <Skeleton className="h-4 w-full" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
