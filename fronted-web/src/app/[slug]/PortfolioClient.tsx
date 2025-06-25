'use client';

import DefaultTemplate from '@/components/templates/DefaultTemplate';
import TemplateOne from '@/components/templates/TemplateOne';
import TemplateTwo from '@/components/templates/TemplateTwo';
import { useGetUserSettingsBySlugQuery } from '@/redux/settings/settingsApi';

interface Settings {
    template?: string;
}

export default function PortfolioClient({
    initialSettings,
    slug,
}: {
    initialSettings: Settings;
    slug: string;
}) {
    const { data: settings, isLoading } = useGetUserSettingsBySlugQuery(slug, {
        skip: !!initialSettings,
    });

    const template = settings?.template || initialSettings?.template;

    if (isLoading && !template) return <p>Loading...</p>;

    const renderTemplate = () => {
        switch (template) {
            case 'template1':
                return <TemplateOne />;
            case 'template2':
                return <TemplateTwo />;
            default:
                return <DefaultTemplate />;
        }
    };

    return <>{renderTemplate()}</>;
}
