'use client';

import { BlogEditor } from '@/components/blog/BlogEditor';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Feather } from 'lucide-react';
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Feather className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                        New Article
                    </h1>
                    <p className="text-muted-foreground">
                        Create a new blog post to share with your audience.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-orange-100/20 bg-card/80 backdrop-blur-sm p-6 shadow-sm overflow-hidden">
                <BlogEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </motion.div>
    );
}
