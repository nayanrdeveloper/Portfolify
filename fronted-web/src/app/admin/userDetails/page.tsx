'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function DetailsPage() {
    // For demonstration, we use local state with default empty values.
    // In a production app, you might fetch these details from an API.
    const [details, setDetails] = useState({
        title: '',
        bio: '',
        location: '',
        profilePictureURL: '',
        githubURL: '',
        linkedInURL: '',
        twitterURL: '',
    });

    // Optionally, load your personal details on mount.
    // useEffect(() => {
    //   fetch("/api/details")
    //     .then((res) => res.json())
    //     .then((data) => setDetails(data))
    //     .catch((err) => console.error("Error fetching details:", err));
    // }, []);

    const handleChange = (field: string, value: string) => {
        setDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // In production, you would send an API call here to update the details.
        console.log('Saving details:', details);
        // Optionally, redirect or show a success message.
        // router.push("/"); // For example, return to a dashboard.
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Personal Details</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={details.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g., Senior Developer"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                        id="bio"
                        value={details.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        placeholder="Tell us about yourself"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={details.location}
                        onChange={(e) =>
                            handleChange('location', e.target.value)
                        }
                        placeholder="Your location"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="profilePictureURL">
                        Profile Picture URL
                    </Label>
                    <Input
                        id="profilePictureURL"
                        value={details.profilePictureURL}
                        onChange={(e) =>
                            handleChange('profilePictureURL', e.target.value)
                        }
                        placeholder="https://example.com/your-photo.jpg"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="githubURL">GitHub URL</Label>
                    <Input
                        id="githubURL"
                        value={details.githubURL}
                        onChange={(e) =>
                            handleChange('githubURL', e.target.value)
                        }
                        placeholder="https://github.com/yourusername"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="linkedInURL">LinkedIn URL</Label>
                    <Input
                        id="linkedInURL"
                        value={details.linkedInURL}
                        onChange={(e) =>
                            handleChange('linkedInURL', e.target.value)
                        }
                        placeholder="https://linkedin.com/in/yourusername"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="twitterURL">Twitter URL</Label>
                    <Input
                        id="twitterURL"
                        value={details.twitterURL}
                        onChange={(e) =>
                            handleChange('twitterURL', e.target.value)
                        }
                        placeholder="https://twitter.com/yourusername"
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
