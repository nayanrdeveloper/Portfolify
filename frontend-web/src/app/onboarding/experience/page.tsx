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
import { Briefcase, GraduationCap, Loader2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ExperiencePage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [isLoadingExp, setIsLoadingExp] = useState(false);
    const [isLoadingEdu, setIsLoadingEdu] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Experience Form
    const {
        register: registerExp,
        handleSubmit: handleSubmitExp,
        reset: resetExp,
        formState: { errors: errorsExp },
    } = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            isCurrent: false,
        },
    });

    // Education Form
    const {
        register: registerEdu,
        handleSubmit: handleSubmitEdu,
        reset: resetEdu,
        formState: { errors: errorsEdu },
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            isCurrent: false,
        },
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
            alert('Failed to add experience');
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
            alert('Failed to add education');
        } finally {
            setIsLoadingEdu(false);
        }
    };

    const handleDeleteExp = async (id: string) => {
        if (!confirm('Delete this experience?')) return;
        try {
            await api.delete(`/experiences/${id}`);
            setExperiences(experiences.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete experience', error);
        }
    };

    const handleDeleteEdu = async (id: string) => {
        if (!confirm('Delete this education?')) return;
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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side: Forms */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 overflow-y-auto bg-background">
                <div className="max-w-xl mx-auto space-y-12">
                    {/* Experience Section */}
                    <section>
                        <h1 className="text-3xl font-bold mb-2">Work Experience</h1>
                        <p className="text-muted-foreground mb-6">
                            Add your relevant work history.
                        </p>

                        <form
                            onSubmit={handleSubmitExp(onSubmitExp)}
                            className="space-y-4 border p-6 rounded-xl bg-card/50 mb-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Senior Developer"
                                        {...registerExp('title')}
                                    />
                                    {errorsExp.title && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errorsExp.title.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Acme Corp"
                                        {...registerExp('company')}
                                    />
                                    {errorsExp.company && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errorsExp.company.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        {...registerExp('startDate')}
                                    />
                                    {errorsExp.startDate && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errorsExp.startDate.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        {...registerExp('endDate')}
                                    />
                                    {errorsExp.endDate && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errorsExp.endDate.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Describe your role..."
                                    {...registerExp('description')}
                                />
                            </div>

                            <Button type="submit" disabled={isLoadingExp} className="w-full">
                                {isLoadingExp ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" /> Add Experience
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="space-y-4">
                            {experiences.map(exp => (
                                <div
                                    key={exp._id}
                                    className="flex justify-between items-start p-4 bg-card border rounded-lg"
                                >
                                    <div>
                                        <h4 className="font-semibold">{exp.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {exp.company}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {exp.startDate} - {exp.endDate || 'Present'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteExp(exp._id)}
                                        className="text-muted-foreground hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education Section */}
                    <section>
                        <h1 className="text-3xl font-bold mb-2">Education</h1>
                        <p className="text-muted-foreground mb-6">
                            Add your educational background.
                        </p>

                        <form
                            onSubmit={handleSubmitEdu(onSubmitEdu)}
                            className="space-y-4 border p-6 rounded-xl bg-card/50 mb-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Institution
                                    </label>
                                    <input
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="University of Tech"
                                        {...registerEdu('institution')}
                                    />
                                    {errorsEdu.institution && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errorsEdu.institution.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Degree</label>
                                    <input
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="B.S. Computer Science"
                                        {...registerEdu('degree')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        {...registerEdu('startDate')}
                                    />
                                    {errorsEdu.startDate && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errorsEdu.startDate.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        {...registerEdu('endDate')}
                                    />
                                    {errorsEdu.endDate && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errorsEdu.endDate.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" disabled={isLoadingEdu} className="w-full">
                                {isLoadingEdu ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" /> Add Education
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="space-y-4">
                            {educations.map(edu => (
                                <div
                                    key={edu._id}
                                    className="flex justify-between items-start p-4 bg-card border rounded-lg"
                                >
                                    <div>
                                        <h4 className="font-semibold">{edu.institution}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {edu.degree}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {edu.startDate} - {edu.endDate || 'Present'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEdu(edu._id)}
                                        className="text-muted-foreground hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="pt-6 border-t flex justify-end">
                        <Button onClick={handleContinue} size="lg">
                            Continue to Contact
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className="hidden lg:block w-1/2 bg-muted/30 p-12 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border p-8 h-[600px] overflow-y-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Briefcase className="h-6 w-6" /> Experience
                            </h2>
                            <div className="space-y-6 border-l-2 border-muted pl-4 ml-2">
                                {experiences.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">
                                        Add experience...
                                    </p>
                                ) : (
                                    experiences.map(exp => (
                                        <div key={exp._id} className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                                            <h3 className="font-semibold">{exp.title}</h3>
                                            <p className="text-sm text-primary">{exp.company}</p>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {exp.startDate} — {exp.endDate || 'Present'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <GraduationCap className="h-6 w-6" /> Education
                            </h2>
                            <div className="space-y-6 border-l-2 border-muted pl-4 ml-2">
                                {educations.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">
                                        Add education...
                                    </p>
                                ) : (
                                    educations.map(edu => (
                                        <div key={edu._id} className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                                            <h3 className="font-semibold">{edu.institution}</h3>
                                            <p className="text-sm text-primary">{edu.degree}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {edu.startDate} — {edu.endDate || 'Present'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
