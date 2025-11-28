'use client';

import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import StandardTemplate from '@/components/templates/StandardTemplate';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PublicPortfolioPage() {
    const params = useParams();
    const username = params.username as string;

    const [data, setData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch User Details (Public)
                const userRes = await api.get(`/user-details/slug/${username}`);
                const userDetails = userRes.data.data;

                // 2. Fetch Settings (Theme)
                const settingsRes = await api.get(`/settings/user/${username}`);
                const userSettings = settingsRes.data.data;

                // 3. Fetch Related Data (Projects, Skills, Achievements, etc.)
                // Assuming these endpoints exist as verified
                const [projectsRes, skillsRes, achievementsRes] = await Promise.all([
                    api.get(`/projects/user/${username}`),
                    api.get(`/skills/user/${username}`),
                    api.get(`/achievements/user/${username}`),
                ]);

                setData({
                    userDetails,
                    projects: projectsRes.data.data,
                    skills: skillsRes.data.data,
                    achievements: achievementsRes.data.data,
                    socialMedia: userDetails.socialMedia || {}, // Assuming socialMedia is part of userDetails or separate
                });
                setSettings(userSettings);
            } catch (err: any) {
                // eslint-disable-line @typescript-eslint/no-explicit-any
                console.error('Error fetching portfolio data:', err);
                setError('User not found or failed to load portfolio.');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold mb-2">Oops!</h1>
                <p className="text-muted-foreground">{error || 'User not found.'}</p>
            </div>
        );
    }

    // Render Template based on settings
    const template = settings?.template;
    console.log(template);
    switch (template) {
        case 'default':
            return <ModernTemplate data={data} />;
        case 'creative':
            return <CreativeTemplate data={data} />;
        case 'professional':
            return <ProfessionalTemplate data={data} />;
        case 'standard':
        default:
            return <StandardTemplate data={data} customization={settings?.customization} />;
    }
}
