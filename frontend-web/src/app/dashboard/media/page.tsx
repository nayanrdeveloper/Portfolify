'use client';

import { MediaLibrary } from '@/components/media/MediaLibrary';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

export default function MediaPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col gap-6"
        >
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <ImageIcon className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Media Library
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your images and assets for your portfolio.
                    </p>
                </div>
            </div>

            <div className="flex-1 rounded-xl border border-indigo-100/20 bg-card/50 backdrop-blur-sm p-6 shadow-sm overflow-hidden flex flex-col">
                <MediaLibrary mode="manage" />
            </div>
        </motion.div>
    );
}
