'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    useGetProjectByIDQuery,
    useUpdateProjectMutation,
} from '@/redux/projects/projectApi';
import { useUploadMultipleMutation } from '@/redux/uploads/uploadsApi';
import type { Project } from '@/redux/projects/projectsTypes';
import FormSkeleton from '@/components/common/FormSkeleton';
import Image from 'next/image';

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const { data, isLoading, isError } = useGetProjectByIDQuery(projectId);
    const [
        updateProject,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateProjectMutation();
    const [uploadMultiple] = useUploadMultipleMutation();

    // Local state for project fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [demoLink, setDemoLink] = useState('');

    // State for media URLs (existing) and new files
    const [existingMedia, setExistingMedia] = useState<string[]>([]);
    const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
    const [newMediaPreviews, setNewMediaPreviews] = useState<string[]>([]);

    useEffect(() => {
        console.log('data', data);
        if (data) {
            const project = data as Project;
            setName(project.name);
            setDescription(project.description);
            setGithubLink(project.githubLink);
            setDemoLink(project.demoLink);
            setExistingMedia(project.mediaUrls || []);
        }
    }, [data]);

    // Handle new media file selection
    const handleNewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setNewMediaFiles(files);
            const previews = files.map((file) => URL.createObjectURL(file));
            setNewMediaPreviews(previews);
        }
    };

    // Remove an existing media URL
    const handleRemoveExistingMedia = (url: string) => {
        setExistingMedia((prev) => prev.filter((item) => item !== url));
    };

    // Remove a new media file (and its preview)
    const handleRemoveNewMedia = (index: number) => {
        setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
        setNewMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // On form submission, first upload new media (if any), then update the project with combined media URLs.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uploadedNewMediaUrls: string[] = [];
        if (newMediaFiles.length > 0) {
            try {
                const response = await uploadMultiple({
                    files: newMediaFiles,
                    folder: 'project_media',
                }).unwrap();
                uploadedNewMediaUrls = response;
            } catch (err) {
                console.error('Failed to upload new media:', err);
                // Optionally, you might want to abort the update if upload fails.
            }
        }

        // Combine remaining existing media and newly uploaded media
        const combinedMediaUrls = [...existingMedia, ...uploadedNewMediaUrls];

        try {
            await updateProject({
                id: projectId,
                name,
                description,
                githubLink: githubLink,
                demoLink: demoLink,
                mediaUrls: combinedMediaUrls,
            }).unwrap();
            router.push('/admin/projects');
        } catch (err) {
            console.error('Failed to update project:', err);
        }
    };

    if (isLoading) return <FormSkeleton fields={7} variant="centered" />;
    if (isError) return <div>Error loading project details.</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded shadow"
            >
                {/* Basic project fields */}
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

                {/* Existing Media Preview */}
                <div>
                    <Label className="block mb-2">Existing Media</Label>
                    {existingMedia.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No media uploaded yet.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            {existingMedia.map((url, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        key={index}
                                        src={url}
                                        width={96}
                                        height={96}
                                        alt={`Existing media ${index + 1}`}
                                        className="object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveExistingMedia(url)
                                        }
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* New Media Upload */}
                <div>
                    <Label htmlFor="newMediaFiles" className="block mb-2">
                        Add New Media (Optional)
                    </Label>
                    <Input
                        id="newMediaFiles"
                        type="file"
                        multiple
                        onChange={handleNewFilesChange}
                        className="mt-1"
                    />
                    {newMediaPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-2">
                            {newMediaPreviews.map((url, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        key={index}
                                        src={url} // the object-URL or remote URL
                                        alt={`New media preview ${index + 1}`}
                                        width={96}
                                        height={96}
                                        unoptimized // ← skip optimisation; silences the rule
                                        className="object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveNewMedia(index)
                                        }
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
