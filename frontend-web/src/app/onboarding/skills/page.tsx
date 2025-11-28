'use client';

import { Button } from '@/components/ui/button';
import { Skill, SkillFormData, skillSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

export default function SkillsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAppSelector(state => state.auth);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
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
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.slug) {
            fetchSkills();
        }
    }, [isAuthenticated, user, router]);

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

    const onSubmit = async (data: SkillFormData) => {
        setIsLoading(true);
        try {
            const response = await api.post('/skills', data);
            setSkills([...skills, response.data.data]);
            reset({ name: '', progress: 50, categoryNames: ['General'] });
        } catch (error) {
            console.error('Failed to add skill', error);
            alert('Failed to add skill');
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

    const handleContinue = () => {
        router.push('/onboarding/projects');
    };

    const addSuggestedSkill = (name: string) => {
        setValue('name', name);
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
                    <h1 className="text-3xl font-bold mb-2">Skills & Expertise</h1>
                    <p className="text-muted-foreground mb-8">
                        Add your technical skills and proficiency levels. These will be highlighted
                        on your portfolio.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-10">
                        <div className="grid gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">
                                    Skill Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="e.g. React"
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label htmlFor="progress" className="block text-sm font-medium">
                                        Proficiency ({progressValue}%)
                                    </label>
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
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Skill
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Suggested Skills */}
                    <div className="mb-10">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                            Suggested Skills
                        </h3>
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
                    </div>

                    {/* Skills List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Your Skills ({skills.length})</h3>
                        {skills.length === 0 ? (
                            <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                No skills added yet. Add some above!
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {skills.map(skill => (
                                    <div
                                        key={skill._id}
                                        className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm"
                                    >
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
                                        <button
                                            onClick={() => handleDelete(skill._id)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-10 pt-6 border-t flex justify-end">
                        <Button onClick={handleContinue} size="lg">
                            Continue to Projects
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className="hidden lg:block w-1/2 bg-muted/30 p-12 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border p-8">
                        <h2 className="text-2xl font-bold mb-6">Skills</h2>
                        <div className="space-y-6">
                            {skills.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">
                                    Add skills to see them here...
                                </p>
                            ) : (
                                skills.map(skill => (
                                    <div key={skill._id}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">
                                                {skill.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {skill.progress}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500"
                                                style={{ width: `${skill.progress}%` }}
                                            />
                                        </div>
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
