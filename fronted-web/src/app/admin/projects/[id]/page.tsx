'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    useGetProjectByIDQuery,
    useUpdateProjectMutation,
} from '@/redux/projects/projectApi';
import type { Project } from '@/redux/projects/projectsTypes';

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const { data, isLoading, isError } = useGetProjectByIDQuery(projectId);
    const [
        updateProject,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateProjectMutation();

    // Local state for form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [demoLink, setDemoLink] = useState('');

    useEffect(() => {
        if (data && data.data) {
            const project = data.data as Project;
            setName(project.name);
            setDescription(project.description);
            setGithubLink(project.github_link);
            setDemoLink(project.demo_link);
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProject({
                id: projectId,
                name,
                description,
                github_link: githubLink,
                demo_link: demoLink,
            }).unwrap();
            router.push('/projects');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) {
        return <div>Loading project...</div>;
    }

    if (isError) {
        return <div>Error loading project details.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
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
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Project'}
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
