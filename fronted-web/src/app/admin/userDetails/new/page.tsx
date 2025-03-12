'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NewUserDetailsPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [githubURL, setGithubURL] = useState('');
    const [linkedInURL, setLinkedInURL] = useState('');
    const [twitterURL, setTwitterURL] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, replace this with an API call to save the record.
        console.log('New User Details:', {
            title,
            bio,
            location,
            profilePictureURL,
            githubURL,
            linkedInURL,
            twitterURL,
        });
        // Redirect back to the user details list page.
        router.push('/userDetails');
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New User Details</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="udTitle">Title</Label>
                    <Input
                        id="udTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Senior Developer"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="udBio">Bio</Label>
                    <Input
                        id="udBio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Enter your bio"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="udLocation">Location</Label>
                    <Input
                        id="udLocation"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., New York, NY"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="udProfilePictureURL">
                        Profile Picture URL
                    </Label>
                    <Input
                        id="udProfilePictureURL"
                        value={profilePictureURL}
                        onChange={(e) => setProfilePictureURL(e.target.value)}
                        placeholder="https://example.com/profile.jpg"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="udGitHubURL">GitHub URL</Label>
                    <Input
                        id="udGitHubURL"
                        value={githubURL}
                        onChange={(e) => setGithubURL(e.target.value)}
                        placeholder="https://github.com/username"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="udLinkedInURL">LinkedIn URL</Label>
                    <Input
                        id="udLinkedInURL"
                        value={linkedInURL}
                        onChange={(e) => setLinkedInURL(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="udTwitterURL">Twitter URL</Label>
                    <Input
                        id="udTwitterURL"
                        value={twitterURL}
                        onChange={(e) => setTwitterURL(e.target.value)}
                        placeholder="https://twitter.com/username"
                        className="mt-1"
                    />
                </div>
                <Button type="submit" variant="default">
                    Save Details
                </Button>
            </form>
        </div>
    );
}
