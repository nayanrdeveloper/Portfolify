'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NewAchievementPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [issuer, setIssuer] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [credentialId, setCredentialId] = useState('');
    const [credentialURL, setCredentialURL] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, submit the data via an API call.
        console.log('New Achievement:', {
            name,
            issuer,
            issueDate,
            expirationDate: expirationDate || null,
            credentialId,
            credentialURL,
            description,
        });
        // Optionally redirect back to the achievements list.
        router.push('/achievements');
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New Achievement</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="achName">Name</Label>
                    <Input
                        id="achName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., AWS Certified Solutions Architect"
                        className="mt-1"
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
                <Button type="submit" variant="default">
                    Save Achievement
                </Button>
            </form>
        </div>
    );
}
