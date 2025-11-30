'use client';

import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Check, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const templates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and professional with blue accents.',
        image: '/images/resume-modern.png', // Placeholder
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional serif layout for corporate roles.',
        image: '/images/resume-classic.png', // Placeholder
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Stark black & white design for creatives.',
        image: '/images/resume-minimal.png', // Placeholder
    },
];

export default function ResumeManagerPage() {
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [settingsRes, userRes, experienceRes, educationRes, skillsRes, projectsRes] =
                await Promise.all([
                    api.get('/settings'),
                    api.get('/user-details/me'),
                    api.get('/experiences'),
                    api.get('/educations'),
                    api.get('/skills'),
                    api.get('/projects'),
                ]);

            if (settingsRes.data.data?.resumeTemplate) {
                setSelectedTemplate(settingsRes.data.data.resumeTemplate);
            }

            setUserData({
                userDetails: userRes.data.data,
                experience: experienceRes.data.data,
                education: educationRes.data.data,
                skills: skillsRes.data.data,
                projects: projectsRes.data.data,
                socialMedia: userRes.data.data.socialMedia,
            });
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast({
                title: 'Error',
                description: 'Failed to load your data.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/settings', { resumeTemplate: selectedTemplate });
            toast({
                title: 'Success',
                description: 'Resume template saved successfully.',
            });
        } catch (error) {
            console.error('Failed to save template', error);
            toast({
                title: 'Error',
                description: 'Failed to save template.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Resume Manager</h2>
                <p className="text-muted-foreground">
                    Select a template for your downloadable resume.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {templates.map(template => (
                    <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:border-primary ${selectedTemplate === template.id ? 'border-2 border-primary ring-2 ring-primary/20' : ''}`}
                        onClick={() => setSelectedTemplate(template.id)}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {template.name}
                                {selectedTemplate === template.id && (
                                    <Check className="h-5 w-5 text-primary" />
                                )}
                            </CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="aspect-[1/1.4] bg-slate-100 flex items-center justify-center relative overflow-hidden rounded-md border">
                            {/* In a real app, we'd use a screenshot. For now, a placeholder. */}
                            <div className="text-center p-4">
                                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                                <p className="text-xs text-slate-500">Preview</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card p-6 shadow-sm">
                <div className="space-y-1">
                    <h3 className="font-semibold">Ready to use?</h3>
                    <p className="text-sm text-muted-foreground">
                        Save your selection to make it the default for your public profile.
                    </p>
                </div>
                <div className="flex gap-4">
                    {typeof window !== 'undefined' && userData && (
                        <PDFDownloadLink
                            key={selectedTemplate}
                            document={
                                <ResumeRenderer template={selectedTemplate} data={userData} />
                            }
                            fileName="resume_preview.pdf"
                        >
                            {({ loading: pdfLoading }) => (
                                <Button variant="outline" disabled={pdfLoading}>
                                    {pdfLoading ? 'Generating...' : 'Download Preview'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save as Default
                    </Button>
                </div>
            </div>
        </div>
    );
}
