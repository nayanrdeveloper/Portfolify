'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { BasicInfoFormData, basicInfoSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Upload, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DashboardAccountPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
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

    const profilePictureUrl = watch('profilePictureUrl');

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await api.get('/user-details/me');
            if (response.data.data) {
                const data = response.data.data;
                reset({
                    fullName: data.fullName || '',
                    title: data.headLine || '', // Mapping headLine to title
                    bio: data.about || '', // Mapping about to bio
                    location: data.location || '',
                    profilePictureUrl: data.profilePictureUrl || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch user details', error);
            // If 404, it means no details yet, which is fine (defaults used)
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmit = async (data: BasicInfoFormData) => {
        setIsLoading(true);
        try {
            // Map form data back to backend schema if needed
            // Backend expects: fullName, headLine, about, location, profilePictureUrl
            const payload = {
                fullName: data.fullName,
                headLine: data.title,
                about: data.bio,
                location: data.location,
                profilePictureUrl: data.profilePictureUrl,
            };

            await api.post('/user-details', payload);
            toast({
                title: 'Profile Updated',
                description: 'Your basic information has been saved successfully.',
            });
        } catch (error) {
            console.error('Failed to save user details', error);
            toast({
                title: 'Error',
                description: 'Failed to save changes. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/uploads/single', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url = response.data.data.secureUrl;
            if (url) {
                setValue('profilePictureUrl', url);
            } else {
                console.error('Upload response missing secureUrl', response.data);
                toast({
                    title: 'Upload Failed',
                    description: 'Invalid server response.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Upload failed', error);
            toast({
                title: 'Upload Failed',
                description: 'Failed to upload image.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your basic profile information.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        This information will be displayed on your public portfolio.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center sm:flex-row gap-6">
                            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-muted bg-muted shrink-0">
                                {profilePictureUrl ? (
                                    <Image
                                        src={profilePictureUrl}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        <UserCircle className="h-16 w-16" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>Profile Picture</Label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            document.getElementById('profile-upload')?.click()
                                        }
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Upload className="mr-2 h-4 w-4" />
                                        )}
                                        Upload New Picture
                                    </Button>
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Recommended size: 400x400px. Max size: 2MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="e.g. John Doe"
                                    {...register('fullName')}
                                />
                                {errors.fullName && (
                                    <p className="text-sm text-red-500">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Professional Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Senior Frontend Developer"
                                    {...register('title')}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                placeholder="e.g. San Francisco, CA"
                                {...register('location')}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Write a short bio about yourself..."
                                className="min-h-[120px]"
                                {...register('bio')}
                            />
                            {errors.bio && (
                                <p className="text-sm text-red-500">{errors.bio.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
