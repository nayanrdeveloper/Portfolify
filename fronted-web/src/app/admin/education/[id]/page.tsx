'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    useGetEducationByIDQuery,
    useUpdateEducationMutation,
} from '@/redux/education/educationApi';
import type { Education } from '@/redux/education/educationTypes';
import FormSkeleton from '@/components/common/FormSkeleton';

export default function EditEducationPage() {
    const router = useRouter();
    const params = useParams();
    const educationId = params.id as string;

    const { data, isLoading, isError } = useGetEducationByIDQuery(educationId);
    const [
        updateEducation,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateEducationMutation();

    const [institution, setInstitution] = useState('');
    const [degree, setDegree] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (data) {
            const edu = data as Education;
            setInstitution(edu.institution);
            setDegree(edu.degree || '');
            setFieldOfStudy(edu.fieldOfStudy || '');
            setStartDate(edu.startDate);
            setEndDate(edu.endDate || '');
            setIsCurrent(edu.isCurrent);
            setDescription(edu.description || '');
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEducation({
                id: educationId,
                institution,
                degree,
                fieldOfStudy: fieldOfStudy,
                startDate: startDate,
                endDate: endDate || '',
                isCurrent: isCurrent,
                description,
            }).unwrap();
            router.push('/education');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) return <FormSkeleton fields={6} variant="centered" />;
    if (isError) return <div>Error loading education record.</div>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Education</h1>
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
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Education'}
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
