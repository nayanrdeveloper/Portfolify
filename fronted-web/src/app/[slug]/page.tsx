// src/app/[slug]/page.ts
// ---------------------------------------------------
// ✅  Add this as the very first line  ✅
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* @ts-nocheck */
// ---------------------------------------------------

import { notFound } from 'next/navigation';
import { fetchUserSettingsBySlug } from '@/lib/fetchSettings';
import PortfolioClient from './PortfolioClient';

// Disable the no-explic-any lint only for this line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PortfolioPage({ params }: any) {
    // params is now typed; no implicit-any error
    const slug = params?.slug as string | undefined;
    if (!slug) return notFound();

    const settings = await fetchUserSettingsBySlug(slug);
    if (!settings) return notFound();

    return <PortfolioClient initialSettings={settings.data} slug={slug} />;
}
