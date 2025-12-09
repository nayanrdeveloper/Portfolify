'use client';

import { Button } from '@/components/ui/button';
import { BasicInfoFormData, basicInfoSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera, Loader2, Sparkles, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePicker } from '@/components/media/MediaLibrary';

export default function BasicInfoPage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<BasicInfoFormData>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            fullName: '',
            title: '',
            bio: '',
            location: '',
            profilePictureUrl: '',
        },
        mode: 'onChange',
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
                    setValue('bio', data.about || '');
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
            const payload = {
                ...data,
                about: data.bio,
            };
            await api.post('/user-details', payload);
            router.push('/onboarding/skills');
        } catch (error) {
            console.error('Failed to save details', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-purple-50/40 to-pink-50/40">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[100px]" />
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-600 text-sm font-medium mb-4">
                            <Sparkles className="h-4 w-4" />
                            <span>Step 1 of 5</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Let's get to know you
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Start building your professional identity with the basics.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Full Name"
                                    id="fullName"
                                    placeholder="e.g. Sarah Miller"
                                    error={errors.fullName?.message}
                                    {...register('fullName')}
                                />
                                <FormInput
                                    label="Professional Title"
                                    id="title"
                                    placeholder="e.g. UX Designer"
                                    error={errors.title?.message}
                                    {...register('title')}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="bio" className="text-sm font-medium text-slate-700 ml-1">
                                    Short Bio
                                </label>
                                <textarea
                                    id="bio"
                                    className="flex min-h-[120px] w-full rounded-2xl border-slate-200 bg-white/50 px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all resize-none shadow-sm"
                                    placeholder="Tell us a bit about yourself, your passions, and what drives you..."
                                    {...register('bio')}
                                />
                                {errors.bio && (
                                    <p className="text-sm text-red-500 ml-1">{errors.bio.message}</p>
                                )}
                            </div>

                            <FormInput
                                label="Location"
                                id="location"
                                placeholder="e.g. New York, NY"
                                error={errors.location?.message}
                                {...register('location')}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">
                                    Profile Picture
                                </label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white/50 shadow-sm">
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-white shadow-md">
                                        {watchedValues.profilePictureUrl ? (
                                            <Image
                                                src={watchedValues.profilePictureUrl}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                <User className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <ImagePicker
                                            value={watchedValues.profilePictureUrl}
                                            onChange={(url) => setValue('profilePictureUrl', url)}
                                            trigger={
                                                <Button type="button" variant="outline" className="w-full justify-start text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                                                    <Camera className="mr-2 h-4 w-4" />
                                                    {watchedValues.profilePictureUrl ? 'Change Photo' : 'Upload Photo'}
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Continue to Skills</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Right Side: Visual Preview */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:flex w-1/2 p-12 items-center justify-center relative z-10"
            >
                <div className="relative w-full max-w-md aspect-[3/4]">
                    {/* Floating Elements */}
                    <div className="absolute top-[-20px] right-[-20px] bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce-slow">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <p className="text-sm font-semibold text-slate-700">Portfolio Live</p>
                        </div>
                    </div>

                    <div className="w-full h-full bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden relative p-8 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent" />

                        <div className="relative mb-6 group cursor-pointer">
                            <div className="h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                <div className="h-full w-full rounded-full border-4 border-white bg-slate-100 overflow-hidden relative">
                                    {watchedValues.profilePictureUrl ? (
                                        <Image
                                            src={watchedValues.profilePictureUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300 bg-slate-50">
                                            <User className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-green-500 h-6 w-6 rounded-full border-4 border-white" />
                        </div>

                        <div className="space-y-2 mb-8 relative z-10">
                            {watchedValues.fullName ? (
                                <h2 className="text-2xl font-bold text-slate-800">{watchedValues.fullName}</h2>
                            ) : (
                                <div className="h-8 w-48 bg-slate-200/50 rounded-lg mx-auto animate-pulse" />
                            )}

                            {watchedValues.title ? (
                                <p className="text-indigo-600 font-medium">{watchedValues.title}</p>
                            ) : (
                                <div className="h-5 w-32 bg-slate-200/50 rounded-lg mx-auto animate-pulse" />
                            )}
                        </div>

                        <div className="w-full space-y-3 relative z-10">
                            {watchedValues.bio ? (
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{watchedValues.bio}</p>
                            ) : (
                                <>
                                    <div className="h-4 w-full bg-slate-100 rounded mx-auto animate-pulse" />
                                    <div className="h-4 w-[90%] bg-slate-100 rounded mx-auto animate-pulse" />
                                    <div className="h-4 w-[80%] bg-slate-100 rounded mx-auto animate-pulse" />
                                </>
                            )}
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
                className={`flex h-12 w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-sm ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
}
