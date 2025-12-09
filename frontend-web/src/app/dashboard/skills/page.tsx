'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Skill, SkillFormData, skillSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, MoreVertical, Pencil, Plus, Trash2, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const SUGGESTED_SKILLS = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'Git',
    'Docker',
    'AWS',
    'GraphQL',
    'SQL',
    'MongoDB',
];

export default function DashboardSkillsPage() {
    const { user } = useAppSelector(state => state.auth);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SkillFormData>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            name: '',
            progress: 50,
            categoryNames: ['General'],
        },
    });

    const progressValue = watch('progress');

    useEffect(() => {
        if (user?.slug) {
            fetchSkills();
        }
    }, [user]);

    const fetchSkills = async () => {
        try {
            const response = await api.get(`/skills/user/${user?.slug}`);
            setSkills(response.data.data);
        } catch (error) {
            console.error('Failed to fetch skills', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleOpenDialog = (skill?: Skill) => {
        if (skill) {
            setEditingSkill(skill);
            setValue('name', skill.name);
            setValue('progress', skill.progress);
            setValue('categoryNames', skill.categoryNames || ['General']);
        } else {
            setEditingSkill(null);
            reset({
                name: '',
                progress: 50,
                categoryNames: ['General'],
            });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: SkillFormData) => {
        setIsLoading(true);
        try {
            if (editingSkill) {
                const response = await api.put(`/skills/${editingSkill._id}`, data);
                setSkills(skills.map(s => (s._id === editingSkill._id ? response.data.data : s)));
            } else {
                const response = await api.post('/skills', data);
                setSkills([...skills, response.data.data]);
            }
            setIsDialogOpen(false);
            reset();
        } catch (error) {
            console.error('Failed to save skill', error);
            alert('Failed to save skill');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        try {
            await api.delete(`/skills/${id}`);
            setSkills(skills.filter(s => s._id !== id));
        } catch (error) {
            console.error('Failed to delete skill', error);
        }
    };

    const addSuggestedSkill = (name: string) => {
        setValue('name', name);
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
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Skills
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your technical skills and proficiency levels.
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {skills.map(skill => (
                    <motion.div key={skill._id} variants={item} layoutId={skill._id}>
                        <Card className="overflow-hidden border-t-4 border-t-violet-500 hover:shadow-lg transition-all hover:scale-[1.02] group">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-14 w-14 flex items-center justify-center">
                                        {/* Circular Progress Background */}
                                        <svg className="absolute inset-0 h-full w-full -rotate-90 text-violet-100">
                                            <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" />
                                        </svg>
                                        {/* Circular Progress Indicator */}
                                        <svg className="absolute inset-0 h-full w-full -rotate-90 text-violet-600">
                                            <circle
                                                cx="28" cy="28" r="24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeDasharray="150"
                                                strokeDashoffset={150 - (150 * skill.progress) / 100}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="relative font-bold text-sm text-violet-700">
                                            {skill.progress}%
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground group-hover:text-violet-600 transition-colors">
                                            {skill.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {skill.categoryNames?.map(cat => (
                                                <span key={cat} className="text-[10px] uppercase tracking-wider font-semibold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                                                    {cat}
                                                </span>
                                            )) || (
                                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        General
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenDialog(skill)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onClick={() => handleDelete(skill._id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {skills.length === 0 && (
                    <motion.div
                        variants={item}
                        className="col-span-full text-center py-16 border-2 border-dashed border-violet-200 bg-violet-50/50 rounded-xl"
                    >
                        <div className="h-16 w-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <Zap className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-xl text-foreground">No skills found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            Add your top technical skills to showcase your expertise to potential employers.
                        </p>
                        <Button
                            onClick={() => handleOpenDialog()}
                            variant="outline"
                            className="mt-6 border-violet-200 hover:bg-violet-100 text-violet-700"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Your First Skill
                        </Button>
                    </motion.div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md border-2 border-violet-100/20 bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                        <div className="mb-4 h-12 w-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                            <Zap className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
                        <DialogDescription>
                            {editingSkill
                                ? 'Update your skill details and proficiency.'
                                : 'Add a new skill to your portfolio.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="space-y-3">
                            <Label htmlFor="name">Skill Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. React"
                                className="bg-background/50 focus:border-violet-500 transition-colors"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {!editingSkill && (
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Suggestions</Label>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTED_SKILLS.map(skill => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => addSuggestedSkill(skill)}
                                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-200"
                                        >
                                            {skill}
                                            <Plus className="ml-1 h-3 w-3 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="progress">Proficiency</Label>
                                <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">
                                    {progressValue}%
                                </span>
                            </div>
                            <input
                                id="progress"
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-violet-600"
                                {...register('progress', { valueAsNumber: true })}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Expert</span>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
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
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingSkill ? 'Save Changes' : 'Add Skill'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
