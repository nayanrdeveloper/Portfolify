'use client';

import { Button } from '@/components/ui/button';
import { AiPolishButton } from '@/components/ai/AiPolishButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Project, ProjectFormData, projectSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ExternalLink,
    Github,
    Loader2,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
    Upload,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

export default function DashboardProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

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
        fetchProjects();
    }, []);

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

    const handleOpenDialog = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setValue('name', project.name);
            setValue('description', project.description);
            setValue('demoLink', project.demoLink || '');
            setValue('githubLink', project.githubLink || '');
            setValue('mediaUrls', project.mediaUrls || []);
        } else {
            setEditingProject(null);
            reset({
                name: '',
                description: '',
                demoLink: '',
                githubLink: '',
                mediaUrls: [],
            });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: ProjectFormData) => {
        setIsLoading(true);
        try {
            if (editingProject) {
                const response = await api.put(`/projects/${editingProject._id}`, data);
                setProjects(
                    projects.map(p => (p._id === editingProject._id ? response.data.data : p)),
                );
            } else {
                const response = await api.post('/projects', data);
                setProjects([...projects, response.data.data]);
            }
            setIsDialogOpen(false);
            reset();
        } catch (error) {
            console.error('Failed to save project', error);
            alert('Failed to save project');
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
            const url = response.data.data.secureUrl;
            if (url) {
                setValue('mediaUrls', [...(mediaUrls || []), url]);
            } else {
                console.error('Upload response missing secureUrl', response.data);
                alert('Upload failed: Invalid server response');
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage and showcase your portfolio projects.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <Card key={project._id} className="overflow-hidden group">
                        <div className="aspect-video relative bg-muted">
                            {project.mediaUrls && project.mediaUrls.length > 0 ? (
                                <Image
                                    src={project.mediaUrls[0]}
                                    alt={project.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    unoptimized
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenDialog(project)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => handleDelete(project._id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                {project.description}
                            </p>
                            <div className="flex gap-3">
                                {project.demoLink && (
                                    <a
                                        href={project.demoLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs flex items-center text-primary hover:underline"
                                    >
                                        <ExternalLink className="h-3 w-3 mr-1" /> Live Demo
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
                        </CardContent>
                    </Card>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <p>No projects found. Create your first project to get started!</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingProject
                                ? 'Make changes to your project details.'
                                : 'Add a new project to your portfolio.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmit(onSubmit, errors =>
                            console.error('Form Validation Errors:', errors),
                        )}
                        className="space-y-6 py-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. E-commerce Dashboard"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="description">Description</Label>
                                <AiPolishButton
                                    initialText={watch('description') || ''}
                                    onPolished={text => setValue('description', text)}
                                />
                            </div>
                            <Textarea
                                id="description"
                                placeholder="Briefly describe what you built..."
                                {...register('description')}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="demoLink">Live Demo URL</Label>
                                <Input
                                    id="demoLink"
                                    type="url"
                                    placeholder="https://..."
                                    {...register('demoLink')}
                                />
                                {errors.demoLink && (
                                    <p className="text-sm text-red-500">
                                        {errors.demoLink.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="githubLink">GitHub URL</Label>
                                <Input
                                    id="githubLink"
                                    type="url"
                                    placeholder="https://github.com/..."
                                    {...register('githubLink')}
                                />
                                {errors.githubLink && (
                                    <p className="text-sm text-red-500">
                                        {errors.githubLink.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Project Images</Label>
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
                                    {mediaUrls.map((url, index) =>
                                        url ? (
                                            <div
                                                key={index}
                                                className="relative aspect-video rounded-md overflow-hidden border group"
                                            >
                                                <Image
                                                    src={url}
                                                    alt="Project"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setValue(
                                                            'mediaUrls',
                                                            mediaUrls.filter((_, i) => i !== index),
                                                        )
                                                    }
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : null,
                                    )}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingProject ? 'Save Changes' : 'Add Project'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
