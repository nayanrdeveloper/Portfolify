'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EducationTable, {
    Education,
} from '@/components/projects/EducationTable';

export default function EducationListPage() {
    // For demo purposes, we use static sample data.
    const [educations] = useState<Education[]>([
        {
            id: 1,
            title: 'Senior Developer',
            company: 'Google',
            location: 'Mountain View, CA',
            startDate: '2020-01-01',
            endDate: '2023-01-01',
            isCurrent: false,
            description: 'Worked on various projects at Google.',
        },
        {
            id: 2,
            title: 'Junior Developer',
            company: 'Facebook',
            location: 'Menlo Park, CA',
            startDate: '2018-05-01',
            endDate: '',
            isCurrent: true,
            description: 'Currently working on social media applications.',
        },
    ]);

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Education</h1>
                <Link href="/admin/education/new">
                    <Button variant="default">Add New Education</Button>
                </Link>
            </div>
            <EducationTable educations={educations} />
        </div>
    );
}
