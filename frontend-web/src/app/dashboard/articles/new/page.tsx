'use client';

import { BlogEditor } from '@/components/blog/BlogEditor';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewArticlePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.post('/blogs', data);
            toast({
                title: 'Success',
                description: 'Article created successfully.',
            });
            router.push('/dashboard/articles');
        } catch (error) {
            console.error('Failed to create article', error);
            toast({
                title: 'Error',
                description: 'Failed to create article.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Article</h1>
                <p className="text-muted-foreground">
                    Create a new blog post to share with your audience.
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <BlogEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
