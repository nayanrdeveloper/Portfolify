'use client';

import { AiPolishButton } from '@/components/ai/AiPolishButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Project, ProjectFormData, projectSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    ExternalLink,
    Github,
    Globe,
    ImageIcon,
    Loader2,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        Projects
                    </h1>
                    <p className="text-muted-foreground">
                        Showcase your best work and creative experiments.
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <motion.div key={project._id} variants={item} layoutId={project._id}>
                        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-card/50 backdrop-blur-sm">
                            <div className="aspect-video relative bg-muted overflow-hidden">
                                {project.mediaUrls && project.mediaUrls.length > 0 ? (
                                    <>
                                        <Image
                                            src={project.mediaUrls[0]}
                                            alt={project.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                                        <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                                        <span className="text-xs opacity-50">No preview</span>
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-md">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleOpenDialog(project)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() => handleDelete(project._id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <CardContent className="flex-1 p-5">
                                <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                    {project.description}
                                </p>
                            </CardContent>

                            <CardFooter className="p-5 pt-0 flex gap-3">
                                {project.demoLink && (
                                    <Button size="sm" variant="outline" className="flex-1 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 h-8 text-xs font-medium" asChild>
                                        <a href={project.demoLink} target="_blank" rel="noreferrer">
                                            <Globe className="h-3 w-3 mr-2" /> Live Demo
                                        </a>
                                    </Button>
                                )}
                                {project.githubLink && (
                                    <Button size="sm" variant="outline" className="flex-1 border-slate-200 hover:bg-slate-50 hover:text-slate-700 h-8 text-xs font-medium" asChild>
                                        <a href={project.githubLink} target="_blank" rel="noreferrer">
                                            <Github className="h-3 w-3 mr-2" /> Code
                                        </a>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}

                {projects.length === 0 && (
                    <motion.div
                        variants={item}
                        className="col-span-full py-16 text-center border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-2xl flex flex-col items-center justify-center"
                    >
                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Create your first project</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Start building your portfolio by adding the projects you are most proud of.
                        </p>
                        <Button onClick={() => handleOpenDialog()} className="bg-emerald-500 hover:bg-emerald-600">
                            Get Started
                        </Button>
                    </motion.div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-emerald-100/20 bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {editingProject ? 'Edit Project' : 'New Project'}
                            <span className="text-emerald-500">•</span>
                        </DialogTitle>
                        <DialogDescription>
                            {editingProject
                                ? 'Update the details of your masterpiece.'
                                : 'Showcase a new project to the world.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 py-4"
                    >
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-sm font-semibold">Project Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. AI-Powered Analytics Dashboard"
                                className="bg-background/50 focus:border-emerald-500 transition-colors h-10"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                                <AiPolishButton
                                    initialText={watch('description') || ''}
                                    onPolished={text => setValue('description', text)}
                                />
                            </div>
                            <Textarea
                                id="description"
                                placeholder="Describe the problem you solved, technologies used, and key features..."
                                className="min-h-[120px] bg-background/50 focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                                {...register('description')}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-3">
                                <Label htmlFor="demoLink" className="flex items-center gap-2 text-sm font-semibold">
                                    <ExternalLink className="h-3 w-3" /> Live Demo URL
                                </Label>
                                <Input
                                    id="demoLink"
                                    type="url"
                                    placeholder="https://myproject.com"
                                    className="bg-background/50 focus:border-emerald-500 transition-colors"
                                    {...register('demoLink')}
                                />
                                {errors.demoLink && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.demoLink.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="githubLink" className="flex items-center gap-2 text-sm font-semibold">
                                    <Github className="h-3 w-3" /> GitHub URL
                                </Label>
                                <Input
                                    id="githubLink"
                                    type="url"
                                    placeholder="https://github.com/username/repo"
                                    className="bg-background/50 focus:border-emerald-500 transition-colors"
                                    {...register('githubLink')}
                                />
                                {errors.githubLink && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.githubLink.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-dashed border-emerald-200/50">
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-sm font-semibold">Project Gallery</Label>
                                <span className="text-xs text-muted-foreground">{mediaUrls?.length || 0} / 3 images</span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {mediaUrls?.map((url, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden group shadow-sm">
                                        <Image
                                            src={url}
                                            alt={`Preview ${index + 1}`}
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
                                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {(!mediaUrls || mediaUrls.length < 3) && (
                                    <div className="relative aspect-video rounded-lg border-2 border-dashed border-muted hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                                        {isUploading ? (
                                            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                        ) : (
                                            <>
                                                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-emerald-500 mb-2 transition-colors" />
                                                <span className="text-xs text-muted-foreground font-medium group-hover:text-emerald-600">Upload</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingProject ? 'Save Changes' : 'Create Project'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
