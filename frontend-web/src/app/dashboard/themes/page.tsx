'use client';

import CreativeTemplate from '@/components/templates/CreativeTemplate';
import EditorialTemplate from '@/components/templates/EditorialTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import StandardTemplate from '@/components/templates/StandardTemplate';
import TechTemplate from '@/components/templates/TechTemplate';
import { Button } from '@/components/ui/button';
import {
    fetchThemeSettings,
    resetCustomization,
    saveThemeSettings,
    setTheme,
    updateCustomization,
} from '@/features/theme/themeSlice';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ExternalLink, Laptop, Layout, Loader2, Palette, RefreshCcw, Save, Smartphone, Tablet, Type, Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const COLORS = [
    '#0f172a', // Slate 900
    '#2563eb', // Blue 600
    '#7c3aed', // Violet 600
    '#db2777', // Pink 600
    '#ea580c', // Orange 600
    '#16a34a', // Green 600
];

const FONTS = ['Inter', 'Roboto', 'Outfit', 'Playfair Display', 'Space Mono'];

export default function ThemesPage() {
    const dispatch = useAppDispatch();
    const { availableThemes, currentThemeId, customizations } = useAppSelector(
        state => state.theme,
    );
    const { user } = useAppSelector(state => state.auth);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'templates' | 'customize'>('templates');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    // Portfolio Data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [previewData, setPreviewData] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchThemeSettings());
    }, [dispatch]);

    useEffect(() => {
        if (currentThemeId === 'standard') {
            setActiveTab('customize');
        } else {
            setActiveTab('templates');
        }
    }, [currentThemeId]);

    // Fetch Preview Data
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.slug) return;
            try {
                const [projectsRes, skillsRes, expRes, eduRes, userRes, blogsRes] = await Promise.all([
                    api.get('/projects'),
                    api.get(`/skills/user/${user.slug}`),
                    api.get('/experiences'),
                    api.get('/educations'),
                    api.get('/user-details/me'),
                    api.get('/blogs', { params: { userId: user._id } }).catch(() => ({ data: { data: [] } })),
                ]);

                setPreviewData({
                    userDetails: userRes.data.data,
                    projects: projectsRes.data.data,
                    skills: skillsRes.data.data,
                    experience: expRes.data.data,
                    education: eduRes.data.data,
                    blogs: blogsRes.data.data,
                    socialMedia: userRes.data.data?.socialMedia || {},
                    resumeTemplate: 'modern' // Default for preview
                });
            } catch (error) {
                console.error('Failed to fetch preview data', error);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleThemeSelect = (themeId: string) => {
        dispatch(setTheme(themeId));
        if (themeId === 'standard') setActiveTab('customize');
    };

    const handleColorChange = (color: string) => {
        dispatch(updateCustomization({ primaryColor: color }));
    };

    const handleFontChange = (font: string) => {
        dispatch(updateCustomization({ fontFamily: font }));
    };

    const handleReset = () => {
        dispatch(resetCustomization());
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await dispatch(
                saveThemeSettings({
                    template: currentThemeId,
                    customization: currentThemeId === 'standard' ? customizations : undefined,
                }),
            ).unwrap();
            alert('Theme saved successfully!');
        } catch {
            alert('Failed to save theme');
        } finally {
            setIsSaving(false);
        }
    };

    const currentTheme = availableThemes.find(t => t.id === currentThemeId);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const renderPreviewContent = () => {
        if (!previewData) return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );

        // Inject customization if on Standard
        const dataWithCustomization = {
            ...previewData,
            // For other templates, backend handles it, but for preview we force the current customization state
            // ONLY if Standard is selected or if we want to allow cross-theme customization (which we restrict in UI)
        };

        switch (currentThemeId) {
            case 'modern': return <ModernTemplate data={dataWithCustomization} />;
            case 'creative': return <CreativeTemplate data={dataWithCustomization} />;
            case 'professional': return <ProfessionalTemplate data={dataWithCustomization} />;
            case 'editorial': return <EditorialTemplate data={dataWithCustomization} />;
            case 'tech': return <TechTemplate data={dataWithCustomization} />;
            case 'standard':
            default:
                return <StandardTemplate data={dataWithCustomization} customization={customizations} />;
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Theme & Design
                    </h1>
                    <p className="text-muted-foreground">
                        Customize your portfolio's look and feel.
                    </p>
                </div>
                {user && (
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/${(user as any).slug}`, '_blank')}
                        className="rounded-xl border-indigo-200 hover:bg-indigo-50 text-indigo-700"
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Launch Portfolio
                    </Button>
                )}
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Controls */}
                <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Tab Switcher */}
                    <div className="bg-slate-100/50 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all",
                                activeTab === 'templates'
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-200/50"
                            )}
                        >
                            <Layout className="h-4 w-4" /> Templates
                        </button>
                        <button
                            onClick={() => setActiveTab('customize')}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all",
                                activeTab === 'customize'
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-200/50"
                            )}
                        >
                            <Palette className="h-4 w-4" /> Customize
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'templates' ? (
                            <motion.div
                                key="templates"
                                variants={container}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                className="grid gap-4"
                            >
                                {availableThemes.filter(t => t.id !== 'standard').map(theme => (
                                    <motion.div
                                        key={theme.id}
                                        variants={item}
                                        onClick={() => handleThemeSelect(theme.id)}
                                        className={cn(
                                            "group cursor-pointer rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.02]",
                                            currentThemeId === theme.id
                                                ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg shadow-indigo-500/10"
                                                : "border-transparent bg-white shadow-sm hover:shadow-md"
                                        )}
                                    >
                                        <div className="aspect-[2/1] relative bg-slate-100 overflow-hidden">
                                            {/* We could render a mini-preview here but images are better for performance */}
                                            <div className={`w-full h-full bg-gradient-to-br ${theme.id === 'modern' ? 'from-slate-800 to-slate-900' :
                                                theme.id === 'creative' ? 'from-purple-100 to-pink-100' :
                                                    theme.id === 'editorial' ? 'from-yellow-200 to-yellow-100' :
                                                        theme.id === 'tech' ? 'from-green-900 to-black' :
                                                            'from-slate-100 to-white'
                                                } flex items-center justify-center relative`}>

                                                <div className="text-center z-10">
                                                    <div className="font-bold text-lg opacity-80 mb-1">{theme.name}</div>
                                                </div>
                                            </div>

                                            {currentThemeId === theme.id && (
                                                <div className="absolute top-3 right-3 bg-indigo-500 text-white p-1.5 rounded-full shadow-lg z-20">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="customize"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-800">Visual Style</h3>
                                            <p className="text-sm text-slate-500">Tailor the colors & typography</p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={handleReset} className="h-8 text-slate-400 hover:text-slate-600">
                                            <Undo2 className="h-3.5 w-3.5 mr-1" /> Reset
                                        </Button>
                                    </div>

                                    {/* Warnings if not standard theme */}
                                    {currentThemeId !== 'standard' && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 flex flex-col gap-3">
                                            <p>Customizations are only available for the Standard layout.</p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleThemeSelect('standard')}
                                                className="bg-white border-amber-200 hover:bg-amber-100 text-amber-900 w-full"
                                            >
                                                Switch to Standard
                                            </Button>
                                        </div>
                                    )}

                                    <div className={cn("space-y-6", currentThemeId !== 'standard' && "opacity-40 pointer-events-none")}>
                                        {/* Colors */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <Palette className="h-4 w-4 text-indigo-500" /> Accent Color
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                {COLORS.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleColorChange(color)}
                                                        className={cn(
                                                            "h-10 w-10 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-sm",
                                                            (customizations.primaryColor === color || (!customizations.primaryColor && currentTheme?.colors.primary === color))
                                                                ? "ring-2 ring-indigo-500 ring-offset-2"
                                                                : "ring-1 ring-black/5"
                                                        )}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-100" />

                                        {/* Fonts */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <Type className="h-4 w-4 text-indigo-500" /> Typography
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {FONTS.map(font => (
                                                    <button
                                                        key={font}
                                                        onClick={() => handleFontChange(font)}
                                                        className={cn(
                                                            "px-4 py-2.5 rounded-lg text-sm border transition-all text-left",
                                                            (customizations.fontFamily === font || (!customizations.fontFamily && currentTheme?.fontFamily === font))
                                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                                                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                                                        )}
                                                        style={{ fontFamily: font }}
                                                    >
                                                        {font}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Bar */}
                    <div className="mt-auto pt-6 sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent p-4 -mx-4 border-t border-slate-200/50">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full h-12 rounded-xl text-base shadow-lg shadow-indigo-500/20"
                        >
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right Panel: Live Preview */}
                <div className="lg:col-span-7 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden flex flex-col relative h-[calc(100vh-8rem)]">
                    <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
                        <div className="flex gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-amber-400" />
                            <div className="h-3 w-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                            <button
                                onClick={() => setPreviewDevice('desktop')}
                                className={cn("p-1.5 rounded hover:bg-white transition-colors", previewDevice === 'desktop' && "bg-white shadow-sm text-indigo-600")}
                            >
                                <Laptop className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setPreviewDevice('tablet')}
                                className={cn("p-1.5 rounded hover:bg-white transition-colors", previewDevice === 'tablet' && "bg-white shadow-sm text-indigo-600")}
                            >
                                <Tablet className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setPreviewDevice('mobile')}
                                className={cn("p-1.5 rounded hover:bg-white transition-colors", previewDevice === 'mobile' && "bg-white shadow-sm text-indigo-600")}
                            >
                                <Smartphone className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden bg-slate-200/50 flex justify-center items-center relative overflow-y-auto">
                        <div
                            className={cn(
                                "bg-white shadow-2xl transition-all duration-300 overflow-hidden relative",
                                previewDevice === 'desktop' ? "w-full h-full" :
                                    previewDevice === 'tablet' ? "w-[768px] h-[1024px] rounded-2xl my-8 shrink-0" :
                                        "w-[375px] h-[812px] rounded-[3rem] border-[8px] border-slate-800 my-8 shrink-0"
                            )}
                            style={{
                                transform: previewDevice === 'desktop' ? 'scale(1)' : 'scale(0.85)',
                                transformOrigin: 'top center'
                            }}
                        >
                            <div className="w-full h-full overflow-y-auto custom-scrollbar">
                                {renderPreviewContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
