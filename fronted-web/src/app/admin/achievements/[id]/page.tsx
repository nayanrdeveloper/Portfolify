'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    useGetAchievementByIDQuery,
    useUpdateAchievementMutation,
} from '@/redux/achievements/achievementApi';
import type { Achievement } from '@/redux/achievements/achievementTypes';
import { formatDate } from '@/lib/dateUtils';
import FormSkeleton from '@/components/common/FormSkeleton';

export default function EditAchievementPage() {
    const router = useRouter();
    const params = useParams();
    const achievementId = params.id as string;

    const { data, isLoading, isError } =
        useGetAchievementByIDQuery(achievementId);
    const [
        updateAchievement,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateAchievementMutation();

    const [name, setName] = useState('');
    const [issuer, setIssuer] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [credentialId, setCredentialId] = useState('');
    const [credentialURL, setCredentialURL] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (data) {
            const ach = data as Achievement;
            setName(ach.name);
            setIssuer(ach.issuer);
            setIssueDate(ach.issueDate.substring(0, 10)); // Extract "YYYY-MM-DD"
            setExpirationDate(
                ach.expirationDate ? ach.expirationDate.substring(0, 10) : '',
            );
            setCredentialId(ach.credentialID || '');
            setCredentialURL(ach.credentialURL || '');
            setDescription(ach.description || '');
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAchievement({
                id: achievementId,
                name,
                issuer,
                issueDate: formatDate(issueDate, 'YYYY-MM-DD'),
                expirationDate: expirationDate
                    ? formatDate(expirationDate, 'YYYY-MM-DD')
                    : '',
                credentialID: credentialId,
                credentialURL: credentialURL,
                description,
            }).unwrap();
            router.push('/admin/achievements');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) return <FormSkeleton fields={7} variant="centered" />;
    if (isError) return <div>Error loading achievement.</div>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Achievement</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded shadow"
            >
                <div>
                    <Label htmlFor="achName">Name</Label>
                    <Input
                        id="achName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., AWS Certified Solutions Architect"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="achIssuer">Issuer</Label>
                    <Input
                        id="achIssuer"
                        value={issuer}
                        onChange={(e) => setIssuer(e.target.value)}
                        placeholder="e.g., Amazon Web Services"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="achIssueDate">Issue Date</Label>
                    <Input
                        id="achIssueDate"
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="achExpirationDate">Expiration Date</Label>
                    <Input
                        id="achExpirationDate"
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="mt-1"
                        placeholder="Leave empty if no expiration"
                    />
                </div>
                <div>
                    <Label htmlFor="achCredentialId">Credential ID</Label>
                    <Input
                        id="achCredentialId"
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        placeholder="Enter credential ID"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="achCredentialURL">Credential URL</Label>
                    <Input
                        id="achCredentialURL"
                        value={credentialURL}
                        onChange={(e) => setCredentialURL(e.target.value)}
                        placeholder="https://..."
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="achDescription">Description</Label>
                    <textarea
                        id="achDescription"
                        className="w-full p-2 border rounded mt-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter achievement description"
                    ></textarea>
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Achievement'}
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
