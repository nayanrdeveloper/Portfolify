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
import { ArrowRight, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export default function ContactPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAppSelector(state => state.auth);
    const [isLoadingContact, setIsLoadingContact] = useState(false);
    const [isLoadingSocial, setIsLoadingSocial] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Contact Info Form
    const {
        register: registerContact,
        handleSubmit: handleSubmitContact,
        setValue: setValueContact,
        formState: { errors: errorsContact },
    } = useForm<ContactInfoFormData>({
        resolver: zodResolver(contactInfoSchema),
    });

    // Social Links Form
    const {
        control,
        register: registerSocial,
        handleSubmit: handleSubmitSocial,
        reset: resetSocial,
        formState: { errors: errorsSocial },
    } = useForm<SocialFormData>({
        resolver: zodResolver(socialSchema),
        defaultValues: {
            links: [{ platform: '', url: '' }],
        },
    });

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
                    api.get('/socialmedia'), // Assuming this endpoint lists social links
                ]);

                const userData = userRes.data.data;
                if (userData) {
                    setValueContact('email', userData.email || '');
                    setValueContact('phoneNumber', userData.phoneNumber || '');
                    setValueContact('location', userData.location || '');
                }

                const socialData = socialRes.data.data;
                if (socialData && socialData.length > 0) {
                    resetSocial({ links: socialData });
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
            alert('Contact info saved!');
        } catch (error) {
            console.error('Failed to save contact info', error);
            alert('Failed to save contact info');
        } finally {
            setIsLoadingContact(false);
        }
    };

    const onSubmitSocial = async (data: SocialFormData) => {
        setIsLoadingSocial(true);
        try {
            // Backend expects { links: [...] } for upsertSocialSchema
            await api.post('/socialmedia', data);
            alert('Social links saved!');
        } catch (error) {
            console.error('Failed to save social links', error);
            alert('Failed to save social links');
        } finally {
            setIsLoadingSocial(false);
        }
    };

    const handleFinish = () => {
        router.push('/dashboard');
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
                    {/* Contact Info Section */}
                    <section>
                        <h1 className="text-3xl font-bold mb-2">Contact Information</h1>
                        <p className="text-muted-foreground mb-6">How can people reach you?</p>

                        <form
                            onSubmit={handleSubmitContact(onSubmitContact)}
                            className="space-y-4 border p-6 rounded-xl bg-card/50 mb-6"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="you@example.com"
                                    {...registerContact('email')}
                                />
                                {errorsContact.email && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errorsContact.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="+1 (555) 000-0000"
                                    {...registerContact('phoneNumber')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="San Francisco, CA"
                                    {...registerContact('location')}
                                />
                            </div>

                            <Button type="submit" disabled={isLoadingContact} className="w-full">
                                {isLoadingContact ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" /> Save Contact Info
                                    </>
                                )}
                            </Button>
                        </form>
                    </section>

                    {/* Social Links Section */}
                    <section>
                        <h1 className="text-3xl font-bold mb-2">Social Profiles</h1>
                        <p className="text-muted-foreground mb-6">
                            Connect your social media accounts.
                        </p>

                        <form
                            onSubmit={handleSubmitSocial(onSubmitSocial)}
                            className="space-y-4 border p-6 rounded-xl bg-card/50 mb-6"
                        >
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Platform (e.g. GitHub)"
                                            {...registerSocial(`links.${index}.platform` as const)}
                                        />
                                        {errorsSocial.links?.[index]?.platform && (
                                            <p className="text-xs text-red-500">
                                                {errorsSocial.links[index]?.platform?.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-[2] space-y-2">
                                        <input
                                            type="url"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="URL"
                                            {...registerSocial(`links.${index}.url` as const)}
                                        />
                                        {errorsSocial.links?.[index]?.url && (
                                            <p className="text-xs text-red-500">
                                                {errorsSocial.links[index]?.url?.message}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="mt-2 text-muted-foreground hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ platform: '', url: '' })}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Social Link
                            </Button>

                            <Button type="submit" disabled={isLoadingSocial} className="w-full">
                                {isLoadingSocial ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" /> Save Social Links
                                    </>
                                )}
                            </Button>
                        </form>
                    </section>

                    <div className="pt-6 border-t flex justify-end">
                        <Button
                            onClick={handleFinish}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Finish Onboarding <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className="hidden lg:block w-1/2 bg-muted/30 p-12 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-muted-foreground mb-8">
                            This is how your contact section will look.
                        </p>

                        <div className="space-y-4 text-left">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                    Email
                                </p>
                                <p className="font-medium">you@example.com</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                    Phone
                                </p>
                                <p className="font-medium">+1 (555) 000-0000</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                    Location
                                </p>
                                <p className="font-medium">San Francisco, CA</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center gap-4">
                            {/* Mock Social Icons */}
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                GH
                            </div>
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                LI
                            </div>
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                TW
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
