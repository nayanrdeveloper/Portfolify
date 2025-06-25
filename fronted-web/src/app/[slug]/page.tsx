import { fetchUserSettingsBySlug } from '@/lib/fetchSettings';
import { notFound } from 'next/navigation';
import PortfolioClient from './PortfolioClient';

type PageProps = {
    params: { slug: string };
    /* Next automatically passes this; it can stay unused */
    searchParams?: Record<string, string | string[] | undefined>;
};

export default async function PortfolioPage({ params }: PageProps) {
    const { slug } = params;

    if (!slug) return notFound();

    const settings = await fetchUserSettingsBySlug(slug);
    if (!settings) return notFound();

    return <PortfolioClient initialSettings={settings.data} slug={slug} />;
}
