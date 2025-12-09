'use client';

import { BlogEditor } from '@/components/blog/BlogEditor';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Edit, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditArticlePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [article, setArticle] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchArticle(params.id as string);
        }
    }, [params.id]);

    const fetchArticle = async (id: string) => {
        try {
            // Using the endpoint we assumed exists or will exist soon.
            // If checking fails, user will see error toast.
            const res = await api.get(`/blogs/id/${id}`);
            setArticle(res.data.data);
        } catch (error) {
            console.error('Failed to fetch article', error);
            toast({
                title: 'Error',
                description: 'Failed to load article.',
                variant: 'destructive',
            });
            router.push('/dashboard/articles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.put(`/blogs/${params.id}`, data);
            toast({
                title: 'Success',
                description: 'Article updated successfully.',
            });
            router.push('/dashboard/articles');
        } catch (error) {
            console.error('Failed to update article', error);
            toast({
                title: 'Error',
                description: 'Failed to update article.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!article) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Edit className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                        Edit Article
                    </h1>
                    <p className="text-muted-foreground">
                        Update your blog post details and content.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-orange-100/20 bg-card/80 backdrop-blur-sm p-6 shadow-sm overflow-hidden">
                <BlogEditor
                    initialData={article}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </motion.div>
    );
}
