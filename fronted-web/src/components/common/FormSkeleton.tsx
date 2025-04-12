'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FormSkeletonProps {
    /**
     * Number of input fields to render.
     * Default: 6
     */
    fields?: number;

    /**
     * Number of grid columns (responsive layout).
     * Default: 2
     */
    columns?: 1 | 2 | 3;

    /**
     * Whether to show the submit button skeleton.
     * Default: true
     */
    showSubmit?: boolean;

    /**
     * Variant style: "default" for full-width forms, "centered" for max-w forms
     */
    variant?: 'default' | 'centered';
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({
    fields = 6,
    columns = 2,
    showSubmit = true,
    variant = 'default',
}) => {
    const fieldArray = Array.from({ length: fields });

    const wrapperClass =
        variant === 'centered'
            ? 'min-h-screen bg-gray-50 flex items-start justify-center px-4 py-10'
            : 'w-full min-h-screen bg-gray-50';

    const cardClass =
        variant === 'centered'
            ? 'w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-6 animate-pulse'
            : 'container mx-auto px-6 py-8 space-y-10 animate-pulse';

    return (
        <div className={wrapperClass}>
            <div className={variant === 'centered' ? cardClass : ''}>
                <div
                    className={
                        variant === 'default'
                            ? 'bg-white rounded-xl shadow p-6 space-y-6'
                            : ''
                    }
                >
                    <Skeleton className="h-6 w-40 mb-2" />

                    <div
                        className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}
                    >
                        {fieldArray.map((_, idx) => (
                            <div key={idx} className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        ))}
                    </div>

                    {showSubmit && (
                        <Skeleton className="h-10 w-full mt-6 rounded-md" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormSkeleton;
