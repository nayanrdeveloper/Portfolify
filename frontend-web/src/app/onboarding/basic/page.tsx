'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import api from '@/lib/api';
import { basicInfoSchema, BasicInfoFormData } from '@/features/onboarding/schema';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';

export default function BasicInfoPage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BasicInfoFormData>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            fullName: '',
            title: '',
            bio: '',
            location: '',
            profilePictureUrl: '',
        },
    });

    const watchedValues = watch();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchDetails = async () => {
            try {
                const response = await api.get('/user-details/me');
                if (response.data.data) {
                    const data = response.data.data;
                    setValue('fullName', data.fullName || '');
                    setValue('title', data.title || '');
                    setValue('bio', data.about || ''); // Mapping 'about' to 'bio'
                    setValue('location', data.location || '');
                    setValue('profilePictureUrl', data.profilePictureUrl || '');
                }
            } catch (error) {
                console.error('Failed to fetch user details', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchDetails();
    }, [isAuthenticated, router, setValue]);

    const onSubmit = async (data: BasicInfoFormData) => {
        setIsLoading(true);
        try {
            // Map 'bio' back to 'about' for backend
            const payload = {
                ...data,
                about: data.bio,
            };
            await api.post('/user-details', payload);
            // Navigate to next step (e.g., /onboarding/skills)
            // For now, just show success or stay here
            alert('Saved successfully!');
        } catch (error) {
            console.error('Failed to save details', error);
            alert('Failed to save details');
        } finally {
            setIsLoading(false);
        }
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
                    <h1 className="text-3xl font-bold mb-2">Basic Information</h1>
                    <p className="text-muted-foreground mb-8">
                        Let's start with the basics. This information will be displayed at the top of your portfolio.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="John Doe"
                                {...register('fullName')}
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-1">
                                Professional Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Frontend Developer"
                                {...register('title')}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium mb-1">
                                Short Bio
                            </label>
                            <textarea
                                id="bio"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="I build pixel-perfect web experiences..."
                                {...register('bio')}
                            />
                            {errors.bio && (
                                <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium mb-1">
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="San Francisco, CA"
                                {...register('location')}
                            />
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="profilePictureUrl" className="block text-sm font-medium mb-1">
                                Profile Picture URL
                            </label>
                            <input
                                id="profilePictureUrl"
                                type="url"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="https://example.com/me.jpg"
                                {...register('profilePictureUrl')}
                            />
                            {errors.profilePictureUrl && (
                                <p className="mt-1 text-sm text-red-500">{errors.profilePictureUrl.message}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save & Continue'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className="hidden lg:block w-1/2 bg-muted/30 p-12 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border transform transition-all duration-300 hover:scale-[1.02]">
                        {/* Preview Header */}
                        <div className="bg-primary h-32 relative">
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                <div className="h-24 w-24 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden">
                                    {watchedValues.profilePictureUrl ? (
                                        <img
                                            src={watchedValues.profilePictureUrl}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-12 w-12 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Preview Body */}
                        <div className="pt-16 pb-8 px-6 text-center">
                            <h2 className="text-2xl font-bold text-foreground">
                                {watchedValues.fullName || 'Your Name'}
                            </h2>
                            <p className="text-primary font-medium mt-1">
                                {watchedValues.title || 'Professional Title'}
                            </p>

                            {watchedValues.location && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    📍 {watchedValues.location}
                                </p>
                            )}

                            <p className="mt-6 text-muted-foreground leading-relaxed">
                                {watchedValues.bio || 'Your short bio will appear here. Tell the world about yourself!'}
                            </p>

                            <div className="mt-8 flex justify-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
