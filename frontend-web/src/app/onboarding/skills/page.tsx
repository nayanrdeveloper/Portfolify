'use client';

import { Button } from '@/components/ui/button';
import { Skill, SkillFormData, skillSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const SUGGESTED_SKILLS = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'Java', 'Go', 'Rust', 'HTML', 'CSS',
    'Tailwind CSS', 'Docker', 'AWS', 'GraphQL', 'SQL', 'MongoDB',
    'Figma', 'UI/UX', 'Testing'
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
            progress: 80, // Default to high proficiency for confidence
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
            reset({ name: '', progress: 80, categoryNames: ['General'] });
        } catch (error) {
            console.error('Failed to add skill', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/50 via-cyan-50/50 to-blue-50/50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-cyan-50/40 to-blue-50/40">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200/20 rounded-full blur-[100px]" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px]" />
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/50 text-cyan-700 text-sm font-medium mb-4">
                            <BrainCircuit className="h-4 w-4" />
                            <span>Step 2 of 5</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            Showcase your expertise
                        </h1>
                        <p className="text-slate-500 text-lg">
                            What tools and technologies do you excel at?
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-6 mb-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700 ml-1 mb-1 block">
                                        Skill Name
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="name"
                                            className="flex-1 h-12 rounded-xl border-slate-200 bg-white/70 px-4 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 transition-all"
                                            placeholder="e.g. React Native"
                                            {...register('name')}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="h-12 w-12 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shrink-0"
                                        >
                                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-red-500 ml-1 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-700 ml-1">
                                            Proficiency Level
                                        </label>
                                        <span className="text-sm font-semibold text-cyan-600">{progressValue}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                                        {...register('progress', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Suggested Skills */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Popular Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_SKILLS.slice(0, 12).map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => addSuggestedSkill(skill)}
                                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white/50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200"
                                    >
                                        {skill}
                                        <Plus className="ml-1.5 h-3 w-3 opacity-50" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Added Skills List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-800">Your Skills</h3>
                            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{skills.length} added</span>
                        </div>

                        <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {skills.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"
                                    >
                                        Add your first skill above to get started!
                                    </motion.div>
                                ) : (
                                    skills.map(skill => (
                                        <motion.div
                                            key={skill._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-xs ring-4 ring-white">
                                                {skill.progress}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-800 truncate">{skill.name}</h4>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                                        style={{ width: `${skill.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(skill._id)}
                                                className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
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
                            className="w-full h-12 rounded-xl text-base bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01]"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Continue to Projects</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Right Side: Visual Preview */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:flex w-1/2 p-12 items-center justify-center relative z-10"
            >
                <div className="relative w-full max-w-lg aspect-square">
                    {/* Floating Orbs */}
                    <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-700" />

                    <div className="w-full h-full bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl relative p-10 flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg transform -rotate-6">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Expertise</h3>
                                <p className="text-sm text-slate-500">How clients see your skills</p>
                            </div>
                        </div>

                        <div className="flex-1 flex content-start flex-wrap gap-3 overflow-hidden relative">
                            {/* Grid Pattern */}
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />

                            <AnimatePresence>
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={skill._id}
                                        layoutId={skill._id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative group"
                                    >
                                        <div
                                            className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-semibold text-slate-700 flex items-center gap-2 group-hover:shadow-md group-hover:border-cyan-200 transition-all cursor-default"
                                            style={{
                                                fontSize: Math.max(0.8, skill.progress / 80) + 'rem',
                                                opacity: Math.max(0.6, skill.progress / 100)
                                            }}
                                        >
                                            {skill.name}
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                        </div>
                                    </motion.div>
                                ))}
                                {skills.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400/50 font-medium">
                                        Skills cloud will appear here...
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/20">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Total Skills</span>
                                <span className="font-bold">{skills.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
