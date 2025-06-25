'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateEducationMutation } from '@/redux/education/educationApi';
import { formatDate } from '@/lib/dateUtils';

export default function NewEducationPage() {
    const router = useRouter();
    const [institution, setInstitution] = useState('');
    const [degree, setDegree] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [description, setDescription] = useState('');

    const [createEducation, { isLoading, isError, error }] =
        useCreateEducationMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEducation({
                institution,
                degree,
                fieldOfStudy: fieldOfStudy,
                startDate: formatDate(startDate, 'YYYY-MM-DD'),
                endDate: endDate ? formatDate(endDate, 'YYYY-MM-DD') : '',
                isCurrent: isCurrent,
                description,
            }).unwrap();
            router.push('/admin/education');
        } catch (err) {
            console.error('Failed to create education:', err);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New Education</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded shadow"
            >
                <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                        id="institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g., Stanford University"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                        id="degree"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                        id="fieldOfStudy"
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1"
                        placeholder="Leave empty if currently active"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        id="isCurrent"
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                    />
                    <Label htmlFor="isCurrent">Currently Active</Label>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        className="w-full p-2 border rounded mt-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter education description"
                    ></textarea>
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Education'}
                </Button>
                {isError && (
                    <p className="text-red-500">
                        Error:{' '}
                        {
                            (error as { data?: { message?: string } })?.data
                                ?.message
                        }
                    </p>
                )}
            </form>
        </div>
    );
}
