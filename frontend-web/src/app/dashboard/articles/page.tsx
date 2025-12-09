'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Edit,
    Eye,
    Feather,
    FileText,
    Loader2,
    MoreVertical,
    Plus,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                        Articles
                    </h1>
                    <p className="text-muted-foreground">
                        Share your thoughts, tutorials, and insights with the world.
                    </p>
                </div>
                <Link href="/dashboard/articles/new">
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" />
                        Write Article
                    </Button>
                </Link>
            </div>

            {articles.length === 0 ? (
                <motion.div
                    variants={item}
                    className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-orange-200 bg-orange-50/30 rounded-3xl"
                >
                    <div className="h-20 w-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                        <Feather className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Your blog is empty</h3>
                    <p className="text-muted-foreground max-w-md mb-8 text-lg">
                        "The art of writing is the art of discovering what you believe." <br />
                        <span className="text-sm italic opacity-80">— Gustave Flaubert</span>
                    </p>
                    <Link href="/dashboard/articles/new">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                            Start Writing
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {articles.map(article => (
                        <motion.div key={article._id} variants={item} layoutId={article._id}>
                            <Card className="flex flex-col h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${article.isPublished
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${article.isPublished ? 'bg-green-500' : 'bg-amber-500'
                                                        }`} />
                                                    {article.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(article.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="font-serif font-bold text-xl tracking-tight leading-7 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 pb-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {article.summary || article.title + '...'}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center bg-muted/20">
                                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1.5" title="Views">
                                            <Eye className="h-3.5 w-3.5" />
                                            {article.views}
                                        </div>
                                        <div className="flex items-center gap-1.5" title="Read Time">
                                            <BookOpen className="h-3.5 w-3.5" />
                                            5 min
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Link href={`/dashboard/articles/${article._id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-orange-600">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(article._id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
