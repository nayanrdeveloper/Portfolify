// app/education/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NewEducationPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, submit the data to your API endpoint.
        console.log('New Education Record:', {
            title,
            company,
            location,
            startDate,
            endDate: endDate || null,
            isCurrent,
            description,
        });
        // After creation, redirect to the education list page.
        router.push('/education');
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New Education</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="eduTitle">Title</Label>
                    <Input
                        id="eduTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Senior Developer"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="eduCompany">Company</Label>
                    <Input
                        id="eduCompany"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Google"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="eduLocation">Location</Label>
                    <Input
                        id="eduLocation"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Mountain View, CA"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="eduStartDate">Start Date</Label>
                    <Input
                        id="eduStartDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="eduEndDate">End Date</Label>
                    <Input
                        id="eduEndDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1"
                        placeholder="Leave empty if currently active"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        id="eduIsCurrent"
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                    />
                    <Label htmlFor="eduIsCurrent">Currently Active</Label>
                </div>
                <div>
                    <Label htmlFor="eduDescription">Description</Label>
                    <textarea
                        id="eduDescription"
                        className="w-full p-2 border rounded mt-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a description of your education experience"
                    ></textarea>
                </div>
                <Button type="submit" variant="default">
                    Save Education
                </Button>
            </form>
        </div>
    );
}
