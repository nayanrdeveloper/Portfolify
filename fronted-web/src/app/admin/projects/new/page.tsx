'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateProjectMutation } from '@/redux/projects/projectApi';
import { useUploadMultipleMutation } from '@/redux/uploads/uploadsApi';
import Image from 'next/image';

export default function NewProjectPage() {
    const router = useRouter();

    // Project fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [demoLink, setDemoLink] = useState('');

    // Media upload state
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

    // RTK Query hooks
    const [createProject, { isLoading: isProjectLoading, isError, error }] =
        useCreateProjectMutation();
    const [uploadMultiple] = useUploadMultipleMutation();

    // Handle file selection and generate preview URLs
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setMediaFiles(filesArray);
            const previews = filesArray.map((file) =>
                URL.createObjectURL(file),
            );
            setMediaPreviews(previews);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uploadedMediaUrls: string[] = [];
        if (mediaFiles.length > 0) {
            try {
                const response = await uploadMultiple({
                    files: mediaFiles,
                    folder: 'project_media',
                }).unwrap();
                uploadedMediaUrls = response;
            } catch (err) {
                console.error('Failed to upload media:', err);
            }
        }

        try {
            await createProject({
                name,
                description,
                githubLink: githubLink,
                demoLink: demoLink,
                mediaUrls: uploadedMediaUrls,
            }).unwrap();
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
                <div>
                    <Label htmlFor="mediaFiles">
                        Upload Project Media (Optional)
                    </Label>
                    <Input
                        id="mediaFiles"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="mt-1"
                    />
                    {mediaPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-2">
                            {mediaPreviews.map((url, index) => (
                                <Image
                                    key={index}
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    width={96}
                                    height={96}
                                    className="object-cover rounded border"
                                />
                            ))}
                        </div>
                    )}
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isProjectLoading}
                >
                    {isProjectLoading ? 'Creating...' : 'Save Project'}
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
