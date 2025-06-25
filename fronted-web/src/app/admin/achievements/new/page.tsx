'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateAchievementMutation } from '@/redux/achievements/achievementApi';
import { formatDate } from '@/lib/dateUtils';

export default function NewAchievementPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [issuer, setIssuer] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [credentialId, setCredentialId] = useState('');
    const [credentialURL, setCredentialURL] = useState('');
    const [description, setDescription] = useState('');

    const [createAchievement, { isLoading, isError, error }] =
        useCreateAchievementMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAchievement({
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
            console.error('Failed to create achievement:', err);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New Achievement</h1>
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
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Achievement'}
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
