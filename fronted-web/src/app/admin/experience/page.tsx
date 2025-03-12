'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ExperienceTable, {
    Experience,
} from '@/components/projects/ExperienceTable';

export default function ExperienceListPage() {
    const [experiences] = useState<Experience[]>([
        {
            id: 1,
            title: 'Senior Developer',
            company: 'Google',
            location: 'Mountain View, CA',
            startDate: '2020-01-01',
            endDate: '2023-01-01',
            isCurrent: false,
            description: 'Worked on various high-impact projects at Google.',
        },
        {
            id: 2,
            title: 'Junior Developer',
            company: 'Facebook',
            location: 'Menlo Park, CA',
            startDate: '2018-05-01',
            endDate: '',
            isCurrent: true,
            description: 'Currently working on cutting-edge social features.',
        },
    ]);

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Experience</h1>
                <Link href="/admin/experience/new">
                    <Button variant="default">Add New Experience</Button>
                </Link>
            </div>
            <ExperienceTable experiences={experiences} />
        </div>
    );
}
