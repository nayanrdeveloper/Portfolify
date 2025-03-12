'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AchievementsTable, {
    Achievement,
} from '@/components/projects/AchievementsTable';

export default function AchievementsListPage() {
    // Sample data for demonstration. Replace with API data in production.
    const [achievements] = useState<Achievement[]>([
        {
            id: 1,
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: '2022-01-01',
            expirationDate: '2025-01-01',
            credentialId: 'ABC123',
            credentialURL: 'https://aws.amazon.com/certification/',
            description:
                'Certified to design and deploy scalable systems on AWS.',
        },
        {
            id: 2,
            name: 'Google Cloud Certified',
            issuer: 'Google Cloud',
            issueDate: '2021-05-01',
            expirationDate: '',
            credentialId: 'XYZ456',
            credentialURL: 'https://cloud.google.com/certification/',
            description:
                'Demonstrates proficiency with Google Cloud technologies.',
        },
    ]);

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Achievements</h1>
                <Link href="/admin/achievements/new">
                    <Button variant="default">Add New Achievement</Button>
                </Link>
            </div>
            <AchievementsTable achievements={achievements} />
        </div>
    );
}
