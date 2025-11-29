'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { Edit, Eye, FileText, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    summary?: string;
    isPublished: boolean;
    views: number;
    createdAt: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await api.get('/blogs');
            setArticles(res.data.data);
        } catch (error) {
            console.error('Failed to fetch articles', error);
            toast({
                title: 'Error',
                description: 'Failed to load articles.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            await api.delete(`/blogs/${id}`);
            setArticles(prev => prev.filter(a => a._id !== id));
            toast({
                title: 'Success',
                description: 'Article deleted successfully.',
            });
        } catch (error) {
            console.error('Failed to delete article', error);
            toast({
                title: 'Error',
                description: 'Failed to delete article.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
                    <p className="text-muted-foreground">
                        Write and manage your blog posts.
                    </p>
                </div>
                <Link href="/dashboard/articles/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Article
                    </Button>
                </Link>
            </div>

            {articles.length === 0 ? (
                <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-muted p-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No articles yet</h3>
                    <p className="text-muted-foreground">
                        Start sharing your knowledge by creating your first article.
                    </p>
                    <Link href="/dashboard/articles/new" className="mt-4">
                        <Button variant="outline">Create Article</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {articles.map(article => (
                        <Card key={article._id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="line-clamp-1 text-lg">
                                        {article.title}
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="line-clamp-3 text-sm text-muted-foreground">
                                    {article.summary || 'No summary provided.'}
                                </p>
                                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {article.views} views
                                    </div>
                                    <div
                                        className={`rounded-full px-2 py-0.5 ${article.isPublished
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}
                                    >
                                        {article.isPublished ? 'Published' : 'Draft'}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t bg-muted/50 p-4">
                                <Link href={`/dashboard/articles/${article._id}`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-3 w-3" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleDelete(article._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
