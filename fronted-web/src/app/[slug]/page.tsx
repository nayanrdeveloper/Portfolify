import { fetchUserSettingsBySlug } from '@/lib/fetchSettings';
import { notFound } from 'next/navigation';
import PortfolioClient from './PortfolioClient';

export default async function PortfolioPage({
    params,
}: {
    params: { slug: string };
}) {
    if (!params || !params.slug) {
        return notFound();
    }

    const settings = await fetchUserSettingsBySlug(params.slug);

    if (!settings) {
        return notFound();
    }

    return <PortfolioClient initialSettings={settings} slug={params.slug} />;
}
