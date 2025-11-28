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
import { Loader2, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
                    <p className="text-muted-foreground">
                        Manage your technical skills and proficiency levels.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => (
                    <Card key={skill._id} className="overflow-hidden">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                    {skill.progress}%
                                </div>
                                <div>
                                    <p className="font-medium">{skill.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {skill.categoryNames?.join(', ') || 'General'}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenDialog(skill)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => handleDelete(skill._id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                    </Card>
                ))}
                {skills.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <p>No skills found. Add some skills to showcase your expertise!</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
                        <DialogDescription>
                            {editingSkill
                                ? 'Update your skill details.'
                                : 'Add a new skill to your portfolio.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Skill Name</Label>
                            <Input id="name" placeholder="e.g. React" {...register('name')} />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {!editingSkill && (
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_SKILLS.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => addSuggestedSkill(skill)}
                                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    >
                                        {skill}
                                        <Plus className="ml-1 h-3 w-3" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="progress">Proficiency</Label>
                                <span className="text-sm text-muted-foreground">
                                    {progressValue}%
                                </span>
                            </div>
                            <input
                                id="progress"
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                {...register('progress', { valueAsNumber: true })}
                            />
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
                                {editingSkill ? 'Save Changes' : 'Add Skill'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
