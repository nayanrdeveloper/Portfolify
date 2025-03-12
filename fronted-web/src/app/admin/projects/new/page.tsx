'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateProjectMutation } from '@/redux/projects/projectApi';

export default function NewProjectPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [demoLink, setDemoLink] = useState('');

    const [createProject, { isLoading, isError, error }] =
        useCreateProjectMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProject({
                name,
                description,
                github_link: githubLink,
                demo_link: demoLink,
            }).unwrap();
            // Redirect to projects list after creation.
            router.push('/admin/projects');
        } catch (err) {
            console.error('Failed to create project:', err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded shadow"
            >
                <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                        id="projectName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter project name"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="projectDesc">Description</Label>
                    <Input
                        id="projectDesc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter project description"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="githubLink">GitHub Link</Label>
                    <Input
                        id="githubLink"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/..."
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="demoLink">Demo Link</Label>
                    <Input
                        id="demoLink"
                        value={demoLink}
                        onChange={(e) => setDemoLink(e.target.value)}
                        placeholder="https://example.com/..."
                        className="mt-1"
                    />
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Save Project'}
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
