'use client';

import { Button } from '@/components/ui/button';
import { Project, ProjectFormData, projectSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Briefcase, ExternalLink, Github, Layers, Loader2, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react';
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
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
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setValue('mediaUrls', mediaUrls?.filter((_, index) => index !== indexToRemove));
    };

    const handleContinue = () => {
        router.push('/onboarding/experience');
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-green-50/50">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-emerald-50/40 via-teal-50/40 to-green-50/40">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[100px]" />
            </div>

            {/* Left Side: Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/2 p-6 lg:p-12 relative z-10 flex flex-col justify-center"
            >
                <div className="max-w-xl mx-auto w-full">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-700 text-sm font-medium mb-4">
                            <Layers className="h-4 w-4" />
                            <span>Step 3 of 5</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Feature your best work
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Add projects that demonstrate your skills and experience.
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-6 mb-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <FormInput
                                label="Project Name"
                                id="name"
                                placeholder="e.g. E-commerce Dashboard"
                                error={errors.name?.message}
                                {...register('name')}
                            />

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-slate-700 ml-1">
                                    Short Description
                                </label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-xl border-slate-200 bg-white/70 px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all resize-none"
                                    placeholder="Briefly describe what you built and the technologies used..."
                                    {...register('description')}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput
                                    label="Live Demo URL"
                                    id="demoLink"
                                    placeholder="https://..."
                                    error={errors.demoLink?.message}
                                    {...register('demoLink')}
                                />
                                <FormInput
                                    label="GitHub URL"
                                    id="githubLink"
                                    placeholder="https://github.com/..."
                                    error={errors.githubLink?.message}
                                    {...register('githubLink')}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Project Images</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {mediaUrls?.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                            <Image
                                                src={url}
                                                alt="Project"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        disabled={isUploading}
                                        className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className="h-5 w-5 mb-1" />
                                                <span className="text-[10px] font-medium">Upload</span>
                                            </>
                                        )}
                                    </button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="secondary"
                                className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-300 transition-all font-medium"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Project
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-800">Added Projects</h3>
                            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{projects.length} added</span>
                        </div>

                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {projects.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-6 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"
                                    >
                                        Projects you add will appear here.
                                    </motion.div>
                                ) : (
                                    projects.map(project => (
                                        <motion.div
                                            key={project._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group"
                                        >
                                            <div className="h-12 w-16 rounded-md bg-slate-100 flex-shrink-0 relative overflow-hidden">
                                                {project.mediaUrls && project.mediaUrls.length > 0 ? (
                                                    <Image
                                                        src={project.mediaUrls[0]}
                                                        alt={project.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <Layers className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-800 text-sm">{project.name}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>
                                                <div className="flex gap-2 mt-1.5">
                                                    {project.demoLink && (
                                                        <a href={project.demoLink} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 flex items-center hover:underline">
                                                            <ExternalLink className="h-2.5 w-2.5 mr-0.5" /> Demo
                                                        </a>
                                                    )}
                                                    {project.githubLink && (
                                                        <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-[10px] text-slate-600 flex items-center hover:underline">
                                                            <Github className="h-2.5 w-2.5 mr-0.5" /> Code
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-8 pt-6">
                        <Button
                            onClick={handleContinue}
                            className="w-full h-12 rounded-xl text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Continue to Experience</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Right Side: Preview */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:flex w-1/2 p-12 items-center justify-center relative z-10"
            >
                <div className="relative w-full max-w-lg aspect-[4/5]">
                    {/* Floating Orbs */}
                    <div className="absolute top-20 right-10 w-20 h-20 bg-emerald-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-20 left-10 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl animate-pulse delay-1000" />

                    <div className="w-full h-full bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl relative p-8 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">My Portfolio</h3>
                                <p className="text-xs text-slate-600">Selected Work</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative z-10">
                            {/* Masonry-style Grid Preview */}
                            <div className="columns-2 gap-4 space-y-4">
                                <AnimatePresence>
                                    {projects.map((project, index) => (
                                        <motion.div
                                            key={project._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                                        >
                                            <div className="aspect-video w-full bg-slate-50 relative">
                                                {project.mediaUrls && project.mediaUrls.length > 0 ? (
                                                    <Image
                                                        src={project.mediaUrls[0]}
                                                        alt={project.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Layers className="text-slate-200 h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-semibold text-slate-800 text-xs mb-1">{project.name}</h4>
                                                <div className="flex gap-1.5 mt-2">
                                                    <div className="h-5 px-2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-medium flex items-center">
                                                        Project
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <div className="break-inside-avoid bg-white/50 border-2 border-dashed border-slate-200 rounded-xl aspect-square flex items-center justify-center p-4 text-center">
                                    <div>
                                        <Plus className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                                        <p className="text-[10px] text-slate-400 font-medium">Add more projects</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function FormInput({ label, id, error, className, ...props }: any) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-medium text-slate-700 ml-1">
                {label}
            </label>
            <input
                id={id}
                className={`flex h-11 w-full rounded-xl border-slate-200 bg-white/70 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
}
