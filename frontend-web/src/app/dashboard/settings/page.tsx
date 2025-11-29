'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { SeoFormData, seoSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DashboardSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [currentSettings, setCurrentSettings] = useState<any>(null);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SeoFormData>({
        resolver: zodResolver(seoSchema),
        defaultValues: {
            title: '',
            description: '',
            keywords: '',
            ogImage: '',
        },
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data.data) {
                const data = response.data.data;
                setCurrentSettings(data);
                if (data.seo) {
                    reset({
                        title: data.seo.title || '',
                        description: data.seo.description || '',
                        keywords: data.seo.keywords ? data.seo.keywords.join(', ') : '',
                        ogImage: data.seo.ogImage || '',
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmit = async (data: SeoFormData) => {
        setIsLoading(true);
        try {
            // We need to send template and customization along with SEO because the backend replaces fields
            const payload = {
                template: currentSettings?.template || 'default',
                customization: currentSettings?.customization || {},
                seo: {
                    title: data.title,
                    description: data.description,
                    keywords: data.keywords
                        ? data.keywords
                              .split(',')
                              .map(k => k.trim())
                              .filter(k => k)
                        : [],
                    ogImage: data.ogImage,
                },
            };

            const response = await api.put('/settings', payload);
            setCurrentSettings(response.data.data);

            toast({
                title: 'Settings Saved',
                description: 'Your SEO settings have been updated successfully.',
            });
        } catch (error) {
            console.error('Failed to save settings', error);
            toast({
                title: 'Error',
                description: 'Failed to save settings. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
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
                <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
                <p className="text-muted-foreground">
                    Manage SEO and other global configurations for your portfolio.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        SEO Configuration
                    </CardTitle>
                    <CardDescription>
                        Optimize your portfolio for search engines and social media sharing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Meta Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. John Doe - Full Stack Developer"
                                {...register('title')}
                            />
                            <p className="text-xs text-muted-foreground">
                                Appears in the browser tab and search results.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Meta Description</Label>
                            <Textarea
                                id="description"
                                placeholder="A brief summary of your portfolio..."
                                {...register('description')}
                            />
                            <p className="text-xs text-muted-foreground">
                                A short description that appears under your title in search results.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input
                                id="keywords"
                                placeholder="e.g. developer, react, portfolio, web design"
                                {...register('keywords')}
                            />
                            <p className="text-xs text-muted-foreground">
                                Comma-separated list of keywords relevant to your portfolio.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ogImage">Social Share Image URL</Label>
                            <Input
                                id="ogImage"
                                placeholder="https://..."
                                {...register('ogImage')}
                            />
                            {errors.ogImage && (
                                <p className="text-sm text-red-500">{errors.ogImage.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                The image that appears when your portfolio is shared on social
                                media.
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Settings
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
