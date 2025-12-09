'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { BarChart3, Eye, FileText, MousePointerClick, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnalyticsStats {
    profileViews: number;
    projectClicks: number;
    articleReads: number;
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

export default function AnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/dashboard');
                setStats(res.data.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <motion.div variants={item}>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Analytics
                </h1>
                <p className="text-muted-foreground mt-2">
                    Track how your portfolio is performing.
                </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
                <motion.div variants={item}>
                    <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
                            <Eye className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.profileViews || 0}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> +12% from last month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Project Clicks</CardTitle>
                            <MousePointerClick className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.projectClicks || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Article Reads</CardTitle>
                            <FileText className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.articleReads || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all articles</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div variants={item}>
                <Card className="col-span-3 border-none shadow-md bg-gradient-to-br from-card to-secondary/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground rounded-xl border border-dashed border-primary/20 bg-card/50 backdrop-blur-sm">
                            <BarChart3 className="w-12 h-12 mb-4 text-primary/40" />
                            <p className="font-medium">Detailed Analytics Visualization</p>
                            <p className="text-sm opacity-60">Coming soon in the next update</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
