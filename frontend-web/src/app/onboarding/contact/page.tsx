'use client';

import { Button } from '@/components/ui/button';
import {
    ContactInfoFormData,
    contactInfoSchema,
    SocialFormData,
    socialSchema,
} from '@/features/onboarding/schema';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Github, Globe, Linkedin, Loader2, Mail, MapPin, Phone, Plus, Rocket, Sparkles, Trash2, Twitter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export default function ContactPage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [isLoadingContact, setIsLoadingContact] = useState(false);
    const [isLoadingSocial, setIsLoadingSocial] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isContactSaved, setIsContactSaved] = useState(false);
    const [isSocialSaved, setIsSocialSaved] = useState(false);

    // Contact Info Form
    const {
        register: registerContact,
        handleSubmit: handleSubmitContact,
        setValue: setValueContact,
        watch: watchContact,
        formState: { errors: errorsContact },
    } = useForm<ContactInfoFormData>({
        resolver: zodResolver(contactInfoSchema),
    });

    const contactValues = watchContact();

    // Social Links Form
    const {
        control,
        register: registerSocial,
        handleSubmit: handleSubmitSocial,
        reset: resetSocial,
        watch: watchSocial,
        formState: { errors: errorsSocial },
    } = useForm<SocialFormData>({
        resolver: zodResolver(socialSchema),
        defaultValues: {
            links: [{ platform: '', url: '' }],
        },
    });

    const socialValues = watchSocial();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'links',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [userRes, socialRes] = await Promise.all([
                    api.get('/user-details/me'),
                    api.get('/socialmedia'),
                ]);

                const userData = userRes.data.data;
                if (userData) {
                    setValueContact('email', userData.email || '');
                    setValueContact('phoneNumber', userData.phoneNumber || '');
                    setValueContact('location', userData.location || '');
                    if (userData.email || userData.phoneNumber || userData.location) setIsContactSaved(true);
                }

                const socialData = socialRes.data.data;
                if (socialData && socialData.length > 0) {
                    resetSocial({ links: socialData });
                    setIsSocialSaved(true);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [isAuthenticated, router, setValueContact, resetSocial]);

    const onSubmitContact = async (data: ContactInfoFormData) => {
        setIsLoadingContact(true);
        try {
            await api.post('/user-details', data);
            setIsContactSaved(true);
        } catch (error) {
            console.error('Failed to save contact info', error);
        } finally {
            setIsLoadingContact(false);
        }
    };

    const onSubmitSocial = async (data: SocialFormData) => {
        setIsLoadingSocial(true);
        try {
            await api.post('/socialmedia', data);
            setIsSocialSaved(true);
        } catch (error) {
            console.error('Failed to save social links', error);
        } finally {
            setIsLoadingSocial(false);
        }
    };

    const handleFinish = () => {
        router.push('/dashboard');
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/50 via-pink-50/50 to-orange-50/50">
                <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-rose-50/40 via-pink-50/40 to-orange-50/40">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-[100px]" />
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/50 text-rose-700 text-sm font-medium mb-4">
                            <Rocket className="h-4 w-4" />
                            <span>Final Step</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            Let&apos;s Connect
                        </h1>
                        <p className="text-slate-500 text-lg">
                            How can people reach you? Set up your contact info.
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm overflow-hidden mb-8">
                        {/* Contact Info Form */}
                        <div className="p-6 border-b border-white/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-rose-500" /> Contact Details
                                </h3>
                                {isContactSaved && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span>}
                            </div>
                            <form onSubmit={handleSubmitContact(onSubmitContact)} className="space-y-4">
                                <FormInput
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    error={errorsContact.email?.message}
                                    {...registerContact('email')}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Phone"
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        {...registerContact('phoneNumber')}
                                    />
                                    <FormInput
                                        label="Location"
                                        placeholder="San Francisco, CA"
                                        {...registerContact('location')}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoadingContact}
                                    className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 h-10 rounded-xl"
                                >
                                    {isLoadingContact ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Contact Info'}
                                </Button>
                            </form>
                        </div>

                        {/* Social Links Form */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-pink-500" /> Social Profiles
                                </h3>
                                {isSocialSaved && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span>}
                            </div>
                            <form onSubmit={handleSubmitSocial(onSubmitSocial)} className="space-y-4">
                                <AnimatePresence>
                                    {fields.map((field, index) => (
                                        <motion.div
                                            key={field.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex gap-3 items-start"
                                        >
                                            <div className="flex-1">
                                                <input
                                                    placeholder="Platform (e.g. GitHub)"
                                                    className="w-full h-10 rounded-xl border-slate-200 bg-white/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                                    {...registerSocial(`links.${index}.platform` as const)}
                                                />
                                                {errorsSocial.links?.[index]?.platform && (
                                                    <p className="text-xs text-red-500 mt-1">{errorsSocial.links[index]?.platform?.message}</p>
                                                )}
                                            </div>
                                            <div className="flex-[2]">
                                                <input
                                                    placeholder="https://..."
                                                    className="w-full h-10 rounded-xl border-slate-200 bg-white/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                                    {...registerSocial(`links.${index}.url` as const)}
                                                />
                                                {errorsSocial.links?.[index]?.url && (
                                                    <p className="text-xs text-red-500 mt-1">{errorsSocial.links[index]?.url?.message}</p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <button
                                    type="button"
                                    onClick={() => append({ platform: '', url: '' })}
                                    className="text-sm text-pink-600 font-medium flex items-center gap-1 hover:underline pl-1"
                                >
                                    <Plus className="h-3 w-3" /> Add another link
                                </button>

                                <Button
                                    type="submit"
                                    disabled={isLoadingSocial}
                                    className="w-full bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200 h-10 rounded-xl"
                                >
                                    {isLoadingSocial ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Social Links'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 pt-6">
                        <Button
                            onClick={handleFinish}
                            className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Rocket className="h-5 w-5 animate-pulse" />
                                <span>Launch Portfolio</span>
                            </div>
                        </Button>
                        <p className="text-center text-xs text-slate-400 mt-3">
                            Check your dashboard to publish clearly
                        </p>
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
                <div className="relative w-full max-w-sm">
                    {/* Floating Orbs */}
                    <div className="absolute top-10 right-0 w-32 h-32 bg-rose-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-10 left-0 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl animate-pulse delay-700" />

                    <div className="w-full bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl relative p-8">
                        <div className="absolute -top-6 -right-6 h-16 w-16 bg-white rounded-2xl shadow-lg border border-pink-100 flex items-center justify-center transform rotate-12">
                            <div className="text-3xl">👋</div>
                        </div>

                        <div className="text-center mb-8">
                            <div className="h-20 w-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {contactValues.email ? contactValues.email.charAt(0).toUpperCase() : 'Me'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {isContactSaved ? 'Ready to Connect!' : 'Contact Card'}
                            </h3>
                            <p className="text-sm text-slate-500">How you&apos;ll look to recruiters</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400 font-medium uppercase">Email</p>
                                    <p className="text-sm font-semibold text-slate-700 truncate">
                                        {contactValues.email || 'your@email.com'}
                                    </p>
                                </div>
                            </div>

                            {(contactValues.phoneNumber) && (
                                <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase">Phone</p>
                                        <p className="text-sm font-semibold text-slate-700">
                                            {contactValues.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {(contactValues.location) && (
                                <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase">Location</p>
                                        <p className="text-sm font-semibold text-slate-700">
                                            {contactValues.location}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <p className="text-center text-xs font-medium text-slate-400 mb-4 uppercase tracking-wider">Find me on</p>
                            <div className="flex justify-center gap-3 flex-wrap">
                                {socialValues.links?.map((link, i) => link.platform && (
                                    <div key={i} className="h-10 px-4 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-2 text-sm font-medium text-slate-600">
                                        {getIconForPlatform(link.platform)}
                                        {link.platform}
                                    </div>
                                ))}
                                {(!socialValues.links || socialValues.links.every(l => !l.platform)) && (
                                    <div className="text-xs text-slate-300 italic">No social links added yet</div>
                                )}
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
                className={`flex h-10 w-full rounded-xl border-slate-200 bg-white/70 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
}

const getIconForPlatform = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github className="h-3.5 w-3.5" />;
    if (p.includes('linkedin')) return <Linkedin className="h-3.5 w-3.5" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="h-3.5 w-3.5" />;
    return <Globe className="h-3.5 w-3.5" />;
};
