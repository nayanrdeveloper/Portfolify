'use client';

import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAppSelector } from '@/lib/store/hooks';
import { Edit, ExternalLink, Eye, Loader2, Plus } from 'lucide-react';
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {userDetails?.fullName || user?.email?.split('@')[0]}!
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
                            <ExternalLink className="mr-2 h-4 w-4" /> Publish
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Projects</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">{stats?.projectsCount}</div>
                    <p className="text-xs text-muted-foreground">+0 from last month</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Skills Listed</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">{stats?.skillsCount}</div>
                    <p className="text-xs text-muted-foreground">Across various categories</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Experience</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">{stats?.experienceCount}</div>
                    <p className="text-xs text-muted-foreground">Roles added</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Profile Score</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">{completionPercentage}%</div>
                    <p className="text-xs text-muted-foreground">Completion rate</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Link
                        href="/onboarding/projects"
                        className="group flex flex-col items-center justify-center p-6 border rounded-xl bg-card hover:bg-muted/50 transition-colors"
                    >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Add Project</span>
                    </Link>
                    <Link
                        href="/onboarding/skills"
                        className="group flex flex-col items-center justify-center p-6 border rounded-xl bg-card hover:bg-muted/50 transition-colors"
                    >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                            <Edit className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Update Skills</span>
                    </Link>
                    <Link
                        href="/onboarding/basic"
                        className="group flex flex-col items-center justify-center p-6 border rounded-xl bg-card hover:bg-muted/50 transition-colors"
                    >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                            <Edit className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Edit Profile</span>
                    </Link>
                </div>
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
