'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { motion } from 'framer-motion';
import {
    Briefcase,
    ExternalLink,
    Eye,
    FileText,
    GraduationCap,
    Layout,
    Loader2,
    Plus,
    Sparkles,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
    projectsCount: number;
    skillsCount: number;
    experienceCount: number;
    educationCount: number;
    messagesCount: number;
}

interface UserDetails {
    fullName?: string;
    title?: string;
    about?: string;
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

export default function DashboardPage() {
    const { user } = useAppSelector(state => state.auth);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [projectsRes, skillsRes, expRes, eduRes, userRes] = await Promise.all([
                    api.get('/projects'),
                    user?.slug
                        ? api.get(`/skills/user/${user.slug}`)
                        : Promise.resolve({ data: { data: [] } }),
                    api.get('/experiences'),
                    api.get('/educations'),
                    api.get('/user-details/me'),
                ]);

                setStats({
                    projectsCount: projectsRes.data.data.length,
                    skillsCount: skillsRes.data.data.length,
                    experienceCount: expRes.data.data.length,
                    educationCount: eduRes.data.data.length,
                    messagesCount: 0,
                });
                setUserDetails(userRes.data.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const completionPercentage = calculateCompletion(stats, userDetails);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Welcome Section */}
            <motion.div variants={item} className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Welcome back, {userDetails?.fullName || user?.email?.split('@')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s what&apos;s happening with your portfolio today.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="hover:bg-primary/5" asChild>
                        <Link href={`/${user?.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" /> View Portfolio
                        </Link>
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div variants={item}>
                    <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <Layout className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.projectsCount}</div>
                            <p className="text-xs text-muted-foreground">Showcased in portfolio</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Skills Listed</CardTitle>
                            <Zap className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.skillsCount}</div>
                            <p className="text-xs text-muted-foreground">Across all categories</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-t-4 border-t-pink-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Experience</CardTitle>
                            <Briefcase className="h-4 w-4 text-pink-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.experienceCount}</div>
                            <p className="text-xs text-muted-foreground">Roles added</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
                            <div className="text-muted-foreground">
                                {completionPercentage >= 100 ? (
                                    <Sparkles className="h-4 w-4 text-green-500" />
                                ) : (
                                    <span className="text-yellow-500 font-bold">★</span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold">{completionPercentage}%</div>
                                <span className="text-xs text-muted-foreground mb-1">
                                    {completionPercentage < 100 ? 'Keep going!' : 'Excellent!'}
                                </span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-secondary overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full rounded-full transition-all ${completionPercentage >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
                                        }`}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Quick Actions */}
                <motion.div variants={item} className="col-span-4">
                    <Card className="h-full border-none shadow-md bg-gradient-to-br from-card to-secondary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-yellow-500" /> Quick Actions
                            </CardTitle>
                            <CardDescription>
                                Manage your portfolio content efficiently.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <Link
                                href="/onboarding/projects"
                                className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-card p-6 hover:bg-primary/5 hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="mb-3 rounded-full bg-purple-500/10 p-3 text-purple-600 group-hover:scale-110 transition-transform">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <span className="font-semibold text-foreground/80 group-hover:text-primary">Add Project</span>
                            </Link>
                            <Link
                                href="/onboarding/skills"
                                className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-card p-6 hover:bg-primary/5 hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="mb-3 rounded-full bg-blue-500/10 p-3 text-blue-600 group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <span className="font-semibold text-foreground/80 group-hover:text-primary">Update Skills</span>
                            </Link>
                            <Link
                                href="/onboarding/experience"
                                className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-card p-6 hover:bg-primary/5 hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="mb-3 rounded-full bg-pink-500/10 p-3 text-pink-600 group-hover:scale-110 transition-transform">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <span className="font-semibold text-foreground/80 group-hover:text-primary">Add Experience</span>
                            </Link>
                            <Link
                                href="/onboarding/education"
                                className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-card p-6 hover:bg-primary/5 hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="mb-3 rounded-full bg-green-500/10 p-3 text-green-600 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <span className="font-semibold text-foreground/80 group-hover:text-primary">Add Education</span>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity / Tips */}
                <motion.div variants={item} className="col-span-3">
                    <Card className="h-full shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-500" /> Portfolio Tips
                            </CardTitle>
                            <CardDescription>
                                Improve your portfolio to attract more opportunities.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 rounded-lg border p-4 bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className="rounded-full bg-blue-500/10 p-2">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Add a Resume</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Upload your latest resume to make it easy for recruiters to
                                            review your qualifications.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 rounded-lg border p-4 bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className="rounded-full bg-purple-500/10 p-2">
                                        <Layout className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Customize Theme</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Choose a theme that matches your personal brand and style.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

function calculateCompletion(stats: DashboardStats | null, userDetails: UserDetails | null) {
    if (!stats || !userDetails) return 0;
    let score = 0;
    if (userDetails.fullName) score += 10;
    if (userDetails.title) score += 10;
    if (userDetails.about) score += 10; // bio mapped to about
    if (stats.skillsCount > 0) score += 20;
    if (stats.projectsCount > 0) score += 20;
    if (stats.experienceCount > 0) score += 15;
    if (stats.educationCount > 0) score += 15;
    return Math.min(score, 100);
}
