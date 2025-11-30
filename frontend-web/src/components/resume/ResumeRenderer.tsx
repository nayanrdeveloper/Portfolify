import { ClassicResume } from './templates/ClassicResume';
import { MinimalResume } from './templates/MinimalResume';
import { ModernResume } from './templates/ModernResume';

interface ResumeRendererProps {
    template: string;
    data: any;
}

export const ResumeRenderer = ({ template, data }: ResumeRendererProps) => {
    switch (template) {
        case 'classic':
            return <ClassicResume data={data} />;
        case 'minimal':
            return <MinimalResume data={data} />;
        case 'modern':
        default:
            return <ModernResume data={data} />;
    }
};
