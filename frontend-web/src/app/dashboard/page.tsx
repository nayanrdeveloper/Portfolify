'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import {
    Briefcase,
    ExternalLink,
    Eye,
    FileText,
    GraduationCap,
    Layout,
    Loader2,
    Plus,
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
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Here&apos;s an overview of your portfolio status.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/p/${user?.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" /> View Portfolio
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/publish">
                            <ExternalLink className="mr-2 h-4 w-4" /> Publish Changes
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Layout className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.projectsCount}</div>
                        <p className="text-xs text-muted-foreground">Showcased in portfolio</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Skills Listed</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.skillsCount}</div>
                        <p className="text-xs text-muted-foreground">Across all categories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Experience</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.experienceCount}</div>
                        <p className="text-xs text-muted-foreground">Roles added</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
                        <div className="text-muted-foreground">
                            {completionPercentage >= 100 ? (
                                <span className="text-green-500">★</span>
                            ) : (
                                <span className="text-yellow-500">★</span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionPercentage}%</div>
                        <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Quick Actions */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Manage your portfolio content efficiently.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Link
                            href="/onboarding/projects"
                            className="group flex flex-col items-center justify-center rounded-lg border border-dashed p-6 hover:bg-muted/50 transition-colors"
                        >
                            <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Add New Project</span>
                        </Link>
                        <Link
                            href="/onboarding/skills"
                            className="group flex flex-col items-center justify-center rounded-lg border border-dashed p-6 hover:bg-muted/50 transition-colors"
                        >
                            <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Update Skills</span>
                        </Link>
                        <Link
                            href="/onboarding/experience"
                            className="group flex flex-col items-center justify-center rounded-lg border border-dashed p-6 hover:bg-muted/50 transition-colors"
                        >
                            <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Add Experience</span>
                        </Link>
                        <Link
                            href="/onboarding/education"
                            className="group flex flex-col items-center justify-center rounded-lg border border-dashed p-6 hover:bg-muted/50 transition-colors"
                        >
                            <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Add Education</span>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity / Tips */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Portfolio Tips</CardTitle>
                        <CardDescription>
                            Improve your portfolio to attract more opportunities.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 rounded-md border p-4">
                                <FileText className="mt-1 h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Add a Resume</p>
                                    <p className="text-sm text-muted-foreground">
                                        Upload your latest resume to make it easy for recruiters to
                                        review your qualifications.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 rounded-md border p-4">
                                <Layout className="mt-1 h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Customize Theme</p>
                                    <p className="text-sm text-muted-foreground">
                                        Choose a theme that matches your personal brand and style.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
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
