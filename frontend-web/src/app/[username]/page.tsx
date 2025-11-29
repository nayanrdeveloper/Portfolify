import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import StandardTemplate from '@/components/templates/StandardTemplate';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    try {
        const settingsRes = await api.get(`/settings/user/${username}`);
        const seo = settingsRes.data.data?.seo;

        if (seo) {
            return {
                title: seo.title,
                description: seo.description,
                keywords: seo.keywords,
                openGraph: {
                    title: seo.title,
                    description: seo.description,
                    images: seo.ogImage ? [seo.ogImage] : [],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: seo.title,
                    description: seo.description,
                    images: seo.ogImage ? [seo.ogImage] : [],
                },
            };
        }
    } catch (error) {
        console.error('Failed to fetch SEO settings', error);
    }

    return {
        title: `${username}'s Portfolio`,
        description: `Check out ${username}'s portfolio on Portfolify.`,
    };
}

export default async function PublicPortfolioPage({ params }: Props) {
    const { username } = await params;
    let data = null;
    let settings = null;
    let error = null;

    try {
        // 1. Fetch User Details (Public)
        const userRes = await api.get(`/user-details/slug/${username}`);
        const userDetails = userRes.data.data;

        // 2. Fetch Settings (Theme)
        const settingsRes = await api.get(`/settings/user/${username}`);
        const userSettings = settingsRes.data.data;

        // 3. Fetch Related Data (Projects, Skills, Achievements, Blogs)
        // We need userId for blogs, which is in userDetails.user
        // Assuming userDetails.user is populated or is the ID.
        // If it's an object, we take _id. If string, use it directly.
        const userId = typeof userDetails.user === 'object' ? userDetails.user._id : userDetails.user;

        const [projectsRes, skillsRes, achievementsRes, blogsRes] = await Promise.all([
            api.get(`/projects/user/${username}`),
            api.get(`/skills/user/${username}`),
            api.get(`/achievements/user/${username}`),
            api.get('/blogs', { params: { userId } }),
        ]);

        data = {
            userDetails,
            projects: projectsRes.data.data,
            skills: skillsRes.data.data,
            achievements: achievementsRes.data.data,
            blogs: blogsRes.data.data,
            socialMedia: userDetails.socialMedia || {},
        };
        settings = userSettings;
    } catch (err) {
        console.error('Error fetching portfolio data:', err);
        error = 'User not found or failed to load portfolio.';
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
