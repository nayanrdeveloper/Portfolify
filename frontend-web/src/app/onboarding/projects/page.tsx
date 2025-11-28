'use client';

import { Button } from '@/components/ui/button';
import { Project, ProjectFormData, projectSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExternalLink, Github, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ProjectsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            description: '',
            demoLink: '',
            githubLink: '',
            mediaUrls: [],
        },
    });

    const mediaUrls = watch('mediaUrls');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchProjects();
    }, [isAuthenticated, router]);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmit = async (data: ProjectFormData) => {
        setIsLoading(true);
        try {
            const response = await api.post('/projects', data);
            setProjects([...projects, response.data.data]);
            reset({
                name: '',
                description: '',
                demoLink: '',
                githubLink: '',
                mediaUrls: [],
            });
        } catch (error) {
            console.error('Failed to add project', error);
            alert('Failed to add project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/uploads/single', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url = response.data.data.url;
            setValue('mediaUrls', [...(mediaUrls || []), url]);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleContinue = () => {
        router.push('/onboarding/experience');
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 overflow-y-auto bg-background">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Featured Projects</h1>
                    <p className="text-muted-foreground mb-8">
                        Showcase your best work. Add projects that demonstrate your skills and
                        experience.
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 mb-10 border p-6 rounded-xl bg-card/50"
                    >
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Project Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. E-commerce Dashboard"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Short Description
                            </label>
                            <textarea
                                id="description"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Briefly describe what you built..."
                                {...register('description')}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="demoLink"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Live Demo URL
                                </label>
                                <input
                                    id="demoLink"
                                    type="url"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="https://..."
                                    {...register('demoLink')}
                                />
                                {errors.demoLink && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.demoLink.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="githubLink"
                                    className="block text-sm font-medium mb-1"
                                >
                                    GitHub URL
                                </label>
                                <input
                                    id="githubLink"
                                    type="url"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="https://github.com/..."
                                    {...register('githubLink')}
                                />
                                {errors.githubLink && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.githubLink.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Project Images</label>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="mr-2 h-4 w-4" />
                                    )}
                                    Upload Image
                                </Button>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <span className="text-xs text-muted-foreground">
                                    {mediaUrls?.length || 0} images uploaded
                                </span>
                            </div>

                            {mediaUrls && mediaUrls.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {mediaUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-video rounded-md overflow-hidden border"
                                        >
                                            <Image
                                                src={url}
                                                alt="Project"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving Project...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Project
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Projects List */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Your Projects ({projects.length})</h3>
                        {projects.length === 0 ? (
                            <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                No projects added yet.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {projects.map(project => (
                                    <div
                                        key={project._id}
                                        className="flex flex-col sm:flex-row gap-4 p-4 bg-card border rounded-lg shadow-sm"
                                    >
                                        {project.mediaUrls && project.mediaUrls.length > 0 && (
                                            <div className="w-full sm:w-32 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0 relative">
                                                <Image
                                                    src={project.mediaUrls[0]}
                                                    alt={project.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-lg">
                                                    {project.name}
                                                </h4>
                                                <button
                                                    onClick={() => handleDelete(project._id)}
                                                    className="text-muted-foreground hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                {project.description}
                                            </p>
                                            <div className="flex gap-3 mt-3">
                                                {project.demoLink && (
                                                    <a
                                                        href={project.demoLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs flex items-center text-primary hover:underline"
                                                    >
                                                        <ExternalLink className="h-3 w-3 mr-1" />{' '}
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.githubLink && (
                                                    <a
                                                        href={project.githubLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs flex items-center text-primary hover:underline"
                                                    >
                                                        <Github className="h-3 w-3 mr-1" /> Code
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-10 pt-6 border-t flex justify-end">
                        <Button onClick={handleContinue} size="lg">
                            Continue to Experience
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className="hidden lg:block w-1/2 bg-muted/30 p-12 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border p-8 h-[600px] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Projects</h2>
                        <div className="grid gap-6">
                            {projects.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">
                                    Add projects to see them here...
                                </p>
                            ) : (
                                projects.map(project => (
                                    <div key={project._id} className="group cursor-pointer">
                                        <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-3 border relative">
                                            {project.mediaUrls && project.mediaUrls.length > 0 ? (
                                                <Image
                                                    src={project.mediaUrls[0]}
                                                    alt={project.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
