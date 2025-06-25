'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    useGetExperienceByIDQuery,
    useUpdateExperienceMutation,
} from '@/redux/experience/experienceApi';
import type { Experience } from '@/redux/experience/experienceTypes';
import { formatDateForAPI } from '@/lib/dateUtils';
import FormSkeleton from '@/components/common/FormSkeleton';

export default function EditExperiencePage() {
    const router = useRouter();
    const params = useParams();
    const experienceId = params.id as string;

    // Fetch the experience record using RTK Query
    const { data, isLoading, isError } =
        useGetExperienceByIDQuery(experienceId);
    const [
        updateExperience,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateExperienceMutation();

    // Local state for form fields
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [description, setDescription] = useState('');

    // Pre-fill form fields when data is available
    useEffect(() => {
        if (data) {
            const exp = data as Experience;
            setTitle(exp.title);
            setCompany(exp.company);
            setLocation(exp.location);
            // Assuming the backend sends dates as ISO strings,
            // you may need to convert them to "YYYY-MM-DD" for the date input.
            setStartDate(exp.startDate.substring(0, 10));
            setEndDate(exp.endDate ? exp.endDate.substring(0, 10) : '');
            setIsCurrent(exp.isCurrent);
            setDescription(exp.description);
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateExperience({
                id: experienceId,
                title,
                company,
                location,
                // Format date values to full ISO strings before sending to API.
                startDate: formatDateForAPI(startDate),
                endDate: endDate ? formatDateForAPI(endDate) : '',
                isCurrent: isCurrent,
                description,
            }).unwrap();
            router.push('/admin/experience');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) return <FormSkeleton fields={7} variant="centered" />;
    if (isError) return <div>Error loading experience record.</div>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Experience</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded shadow"
            >
                <div>
                    <Label htmlFor="expTitle">Title</Label>
                    <Input
                        id="expTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Senior Developer"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="expCompany">Company</Label>
                    <Input
                        id="expCompany"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Google"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="expLocation">Location</Label>
                    <Input
                        id="expLocation"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Mountain View, CA"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="expStartDate">Start Date</Label>
                    <Input
                        id="expStartDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="expEndDate">End Date</Label>
                    <Input
                        id="expEndDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1"
                        placeholder="Leave empty if currently active"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        id="expIsCurrent"
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                    />
                    <Label htmlFor="expIsCurrent">Currently Active</Label>
                </div>
                <div>
                    <Label htmlFor="expDescription">Description</Label>
                    <textarea
                        id="expDescription"
                        className="w-full p-2 border rounded mt-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a description of your experience"
                    ></textarea>
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Experience'}
                </Button>
                {isUpdateError && (
                    <p className="text-red-500">
                        Error:{' '}
                        {
                            (updateError as { data?: { message?: string } })
                                ?.data?.message
                        }
                    </p>
                )}
            </form>
        </div>
    );
}
