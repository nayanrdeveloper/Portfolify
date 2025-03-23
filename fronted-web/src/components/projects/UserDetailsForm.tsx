'use client';

import React, { useState, useEffect } from 'react';
import {
    useGetMyUserDetailsQuery,
    useUpdateMyUserDetailsMutation,
} from '@/redux/userdetails/userdetailsApi';
import { useUploadSingleMutation } from '@/redux/uploads/uploadsApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function UserDetailsForm() {
    const { data: detailsData, isLoading, error } = useGetMyUserDetailsQuery();
    const [updateMyUserDetails, { isLoading: isUpdating }] =
        useUpdateMyUserDetailsMutation();
    const [uploadSingle] = useUploadSingleMutation();

    // Local state for fields
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    // Instead of a text input for profile picture URL,
    // we'll use a file input and manage the preview URL.
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string>('');
    // Other social links
    const [githubURL, setGithubURL] = useState('');
    const [linkedinURL, setLinkedinURL] = useState('');
    const [twitterURL, setTwitterURL] = useState('');

    // Populate fields when data is loaded
    useEffect(() => {
        if (detailsData && detailsData.data) {
            const details = detailsData.data;
            setTitle(details.title);
            setBio(details.bio);
            setLocation(details.location);
            setGithubURL(details.github_url);
            setLinkedinURL(details.linkedin_url);
            setTwitterURL(details.twitter_url);
            if (details.profile_picture_url) {
                setProfilePicPreview(details.profile_picture_url);
            }
        }
    }, [detailsData]);

    // Handle file input change for profile picture
    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfilePicFile(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let secureURL = profilePicPreview; // default: if no new file, use existing URL
        // If a new file is selected, upload it first
        if (profilePicFile) {
            try {
                const response = await uploadSingle({
                    file: profilePicFile,
                    folder: 'profile_pics', // adjust folder name if needed
                }).unwrap();
                secureURL = response.data.secure_url;
            } catch (uploadError) {
                console.error('Failed to upload profile picture:', uploadError);
                // Optionally, you can abort the update if the image upload fails.
            }
        }

        try {
            await updateMyUserDetails({
                title,
                bio,
                location,
                profile_picture_url: secureURL,
                github_url: githubURL,
                linkedin_url: linkedinURL,
                twitter_url: twitterURL,
            }).unwrap();
            // Optionally, show a success toast/message here
        } catch (err) {
            console.error('Failed to update user details:', err);
            // Optionally, show an error toast/message here
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
                <Label htmlFor="profilePic">Profile Picture</Label>
                <Input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="mt-1"
                />
                {profilePicPreview && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Preview:</p>
                        <img
                            src={profilePicPreview}
                            alt="Profile Preview"
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}
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
            <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={isUpdating}
            >
                {isUpdating ? 'Saving...' : 'Save Details'}
            </Button>
        </form>
    );
}
