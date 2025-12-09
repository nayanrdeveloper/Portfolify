'use client';

import { Button } from '@/components/ui/button';
import {
    Education,
    EducationFormData,
    educationSchema,
    Experience,
    ExperienceFormData,
    experienceSchema,
} from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Briefcase, Building2, Calendar, ChevronDown, ChevronRight, GraduationCap, Loader2, Plus, Sparkles, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ExperiencePage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

    // Loaders
    const [isLoadingExp, setIsLoadingExp] = useState(false);
    const [isLoadingEdu, setIsLoadingEdu] = useState(false);

    // Experience Form
    const {
        register: registerExp,
        handleSubmit: handleSubmitExp,
        reset: resetExp,
        formState: { errors: errorsExp },
    } = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: { isCurrent: false },
    });

    // Education Form
    const {
        register: registerEdu,
        handleSubmit: handleSubmitEdu,
        reset: resetEdu,
        formState: { errors: errorsEdu },
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: { isCurrent: false },
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, router]);

    const fetchData = async () => {
        try {
            const [expRes, eduRes] = await Promise.all([
                api.get('/experiences'),
                api.get('/educations'),
            ]);
            setExperiences(expRes.data.data);
            setEducations(eduRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmitExp = async (data: ExperienceFormData) => {
        setIsLoadingExp(true);
        try {
            const response = await api.post('/experiences', data);
            setExperiences([...experiences, response.data.data]);
            resetExp();
        } catch (error) {
            console.error('Failed to add experience', error);
        } finally {
            setIsLoadingExp(false);
        }
    };

    const onSubmitEdu = async (data: EducationFormData) => {
        setIsLoadingEdu(true);
        try {
            const response = await api.post('/educations', data);
            setEducations([...educations, response.data.data]);
            resetEdu();
        } catch (error) {
            console.error('Failed to add education', error);
        } finally {
            setIsLoadingEdu(false);
        }
    };

    const handleDeleteExp = async (id: string) => {
        try {
            await api.delete(`/experiences/${id}`);
            setExperiences(experiences.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete experience', error);
        }
    };

    const handleDeleteEdu = async (id: string) => {
        try {
            await api.delete(`/educations/${id}`);
            setEducations(educations.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete education', error);
        }
    };

    const handleContinue = () => {
        router.push('/onboarding/contact');
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/50 via-violet-50/50 to-blue-50/50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    // Combine and sort for timeline
    const timelineItems = [
        ...experiences.map(e => ({ ...e, type: 'work', date: e.startDate })),
        ...educations.map(e => ({ ...e, type: 'education', date: e.startDate }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="min-h-full flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-violet-50/40 to-blue-50/40">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[100px]" />
            </div>

            {/* Left Side: Forms */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/2 p-6 lg:p-12 relative z-10 flex flex-col justify-center"
            >
                <div className="max-w-xl mx-auto w-full">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-sm font-medium mb-4">
                            <BookOpen className="h-4 w-4" />
                            <span>Step 4 of 5</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Your Journey
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Tell us about your professional background and education.
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm overflow-hidden mb-8">
                        {/* Custom Tabs */}
                        <div className="flex border-b border-slate-100 p-1">
                            <button
                                onClick={() => setActiveTab('experience')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'experience'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50/50'
                                    }`}
                            >
                                <Briefcase className="h-4 w-4" />
                                Work Experience
                            </button>
                            <button
                                onClick={() => setActiveTab('education')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'education'
                                        ? 'bg-white text-violet-600 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50/50'
                                    }`}
                            >
                                <GraduationCap className="h-4 w-4" />
                                Education
                            </button>
                        </div>

                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {activeTab === 'experience' ? (
                                    <motion.form
                                        key="experience-form"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        onSubmit={handleSubmitExp(onSubmitExp)}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Job Title"
                                                placeholder="e.g. Senior Developer"
                                                error={errorsExp.title?.message}
                                                {...registerExp('title')}
                                            />
                                            <FormInput
                                                label="Company"
                                                placeholder="e.g. Acme Corp"
                                                error={errorsExp.company?.message}
                                                {...registerExp('company')}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Start Date"
                                                type="date"
                                                error={errorsExp.startDate?.message}
                                                {...registerExp('startDate')}
                                            />
                                            <FormInput
                                                label="End Date"
                                                type="date"
                                                error={errorsExp.endDate?.message}
                                                {...registerExp('endDate')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 ml-1">Description</label>
                                            <textarea
                                                className="flex min-h-[100px] w-full rounded-xl border-slate-200 bg-white/70 px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all resize-none"
                                                placeholder="Describe your responsibilities and achievements..."
                                                {...registerExp('description')}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isLoadingExp}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl"
                                        >
                                            {isLoadingExp ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Add Experience</>}
                                        </Button>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="education-form"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        onSubmit={handleSubmitEdu(onSubmitEdu)}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Institution"
                                                placeholder="e.g. University of Tech"
                                                error={errorsEdu.institution?.message}
                                                {...registerEdu('institution')}
                                            />
                                            <FormInput
                                                label="Degree"
                                                placeholder="e.g. B.S. in CS"
                                                error={errorsEdu.degree?.message}
                                                {...registerEdu('degree')}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Start Date"
                                                type="date"
                                                error={errorsEdu.startDate?.message}
                                                {...registerEdu('startDate')}
                                            />
                                            <FormInput
                                                label="End Date"
                                                type="date"
                                                error={errorsEdu.endDate?.message}
                                                {...registerEdu('endDate')}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isLoadingEdu}
                                            className="w-full bg-violet-600 hover:bg-violet-700 h-11 rounded-xl"
                                        >
                                            {isLoadingEdu ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Add Education</>}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col min-h-[150px]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">Added History</h3>
                            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{experiences.length + educations.length} items</span>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            <AnimatePresence mode="popLayout">
                                {timelineItems.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-6 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"
                                    >
                                        Add your experience or education to see it here.
                                    </motion.div>
                                ) : (
                                    timelineItems.map((item: any) => (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group"
                                        >
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.type === 'work' ? 'bg-indigo-50 text-indigo-600' : 'bg-violet-50 text-violet-600'
                                                }`}>
                                                {item.type === 'work' ? <Briefcase className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-800 text-sm truncate">
                                                    {item.type === 'work' ? item.title : item.degree}
                                                </h4>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {item.type === 'work' ? item.company : item.institution}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => item.type === 'work' ? handleDeleteExp(item._id) : handleDeleteEdu(item._id)}
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
                            className="w-full h-12 rounded-xl text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01]"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Continue to Contact</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Right Side: Timeline Preview */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:flex w-1/2 p-12 items-center justify-center relative z-10"
            >
                <div className="relative w-full max-w-lg h-[600px]">
                    {/* Floating Orbs */}
                    <div className="absolute top-20 right-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-20 left-10 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl animate-pulse delay-1000" />

                    <div className="w-full h-full bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl relative p-8 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Career Timeline</h3>
                                <p className="text-xs text-slate-600">Your professional path</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative">
                            {/* Vertical Line */}
                            {timelineItems.length > 0 && (
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 z-0" />
                            )}

                            <div className="space-y-8 relative z-10">
                                <AnimatePresence>
                                    {timelineItems.map((item: any, index) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex gap-4 relative"
                                        >
                                            <div className={`flex-shrink-0 h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${item.type === 'work' ? 'bg-indigo-100 text-indigo-600' : 'bg-violet-100 text-violet-600'
                                                }`}>
                                                {item.type === 'work' ? <Briefcase className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                                            </div>
                                            <div className="pb-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        {item.startDate.substring(0, 4)}
                                                    </span>
                                                    <div className="h-px w-8 bg-slate-200" />
                                                </div>
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 w-full min-w-[280px]">
                                                    <h4 className="font-bold text-slate-800 text-sm">
                                                        {item.type === 'work' ? item.title : item.degree}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                        {item.type === 'work' ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                                        <span>{item.type === 'work' ? item.company : item.institution}</span>
                                                    </div>
                                                    {item.description && (
                                                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {timelineItems.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4 pt-20">
                                            <Calendar className="h-12 w-12 opacity-20" />
                                            <p className="text-sm">Your timeline will appear here<br />as you add to your history.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
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
                className={`flex h-11 w-full rounded-xl border-slate-200 bg-white/70 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
}
