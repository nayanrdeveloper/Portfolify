'use client';

import { BlogEditor } from '@/components/blog/BlogEditor';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
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
            // Note: We need an endpoint to get by ID for editing,
            // but our controller currently only has getBySlug for public/protected view.
            // However, getBySlug logic allows owner to view draft.
            // Wait, the controller has getBlogs (list) and getBlogBySlug.
            // It DOES NOT have getById exposed directly in the routes?
            // Let's check blog.route.ts.
            // router.get('/:slug', getBlogBySlug);
            // We might need to add getById or just use the list to find it?
            // No, that's inefficient.
            // Actually, usually for editing we want to fetch by ID.
            // Let's check if I implemented getById in controller/route.
            // I implemented `deleteBlog` which uses ID.
            // I implemented `updateBlog` which uses ID.
            // But for GET, I only have `getBlogs` and `getBlogBySlug`.
            // I should probably add `getBlogById` or just use `getBlogBySlug` if I have the slug?
            // But the URL here is /dashboard/articles/[id].
            // So I have the ID.
            // I should add `GET /blogs/:id` to the backend.
            // OR I can just use the list endpoint with a filter? No.
            // Let's quickly add `getBlogById` to the backend.
            // Wait, I can't easily switch context to backend right now without interrupting flow.
            // Let's check `blog.controller.ts` content again.
            // It has `getBlogBySlug`.
            // Maybe I can just use `getBlogs` with `_id` filter if I supported it?
            // `BlogService.findAll` supports `userId` and `isPublished`.
            // Okay, I should fix the backend to support GET by ID.
            // But for now, let's assume I will fix it.
            // I will write the frontend code assuming `GET /blogs/:id` exists or I'll add it.
            // Actually, `GET /blogs/:slug` is what is defined.
            // If I pass an ID to it, will it work? No, it expects a slug.
            // I'll add `router.get('/id/:id', getBlogById)` to backend.

            // For now, let's write the frontend to call `/blogs/id/${id}` and I will implement that route.
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
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
                <p className="text-muted-foreground">Update your blog post.</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <BlogEditor
                    initialData={article}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
