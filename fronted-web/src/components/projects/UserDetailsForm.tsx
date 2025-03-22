'use client';

import React, { useState, useEffect } from 'react';
import {
    useGetMyUserDetailsQuery,
    useUpdateMyUserDetailsMutation,
} from '@/redux/userdetails/userdetailsApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function UserDetailsForm() {
    const { data: detailsData, isLoading, error } = useGetMyUserDetailsQuery();
    const [updateMyUserDetails, { isLoading: isUpdating }] =
        useUpdateMyUserDetailsMutation();

    // Local state for fields (adjust names to match your model)
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [githubURL, setGithubURL] = useState('');
    const [linkedinURL, setLinkedinURL] = useState('');
    const [twitterURL, setTwitterURL] = useState('');

    useEffect(() => {
        if (detailsData && detailsData.data) {
            const details = detailsData.data;
            setTitle(details.title);
            setBio(details.bio);
            setLocation(details.location);
            setProfilePictureURL(details.profile_picture_url);
            setGithubURL(details.github_url);
            setLinkedinURL(details.linkedin_url);
            setTwitterURL(details.twitter_url);
        }
    }, [detailsData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMyUserDetails({
                title,
                bio,
                location,
                profile_picture_url: profilePictureURL,
                github_url: githubURL,
                linkedin_url: linkedinURL,
                twitter_url: twitterURL,
            }).unwrap();
            // Optionally display a success toast/message here
        } catch (err) {
            console.error('Failed to update user details:', err);
            // Optionally display an error toast/message here
        }
    };

    if (isLoading) return <p>Loading your details...</p>;
    if (error) return <p>Error loading your details</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded shadow"
        >
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your title..."
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Your bio..."
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your location..."
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="profilePictureURL">Profile Picture URL</Label>
                <Input
                    id="profilePictureURL"
                    value={profilePictureURL}
                    onChange={(e) => setProfilePictureURL(e.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="githubURL">GitHub URL</Label>
                <Input
                    id="githubURL"
                    value={githubURL}
                    onChange={(e) => setGithubURL(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="linkedinURL">LinkedIn URL</Label>
                <Input
                    id="linkedinURL"
                    value={linkedinURL}
                    onChange={(e) => setLinkedinURL(e.target.value)}
                    placeholder="https://linkedin.com/in/yourusername"
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="twitterURL">Twitter URL</Label>
                <Input
                    id="twitterURL"
                    value={twitterURL}
                    onChange={(e) => setTwitterURL(e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    className="mt-1"
                />
            </div>
            <Button type="submit" variant="default" className="w-full">
                {isUpdating ? 'Saving...' : 'Save Details'}
            </Button>
        </form>
    );
}
