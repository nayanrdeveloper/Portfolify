'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    fetchThemeSettings,
    resetCustomization,
    saveThemeSettings,
    setTheme,
    updateCustomization,
} from '@/features/theme/themeSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { cn } from '@/lib/utils';
import { Check, ExternalLink, Loader2, Palette, RefreshCcw, Type } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('templates');

    useEffect(() => {
        dispatch(fetchThemeSettings());
    }, [dispatch]);

    useEffect(() => {
        if (currentThemeId === 'standard') {
            setActiveTab('custom');
        } else {
            setActiveTab('templates');
        }
    }, [currentThemeId]);

    const handleThemeSelect = (themeId: string) => {
        dispatch(setTheme(themeId));
    };

    const handleStandardSelect = () => {
        dispatch(setTheme('standard'));
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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Theme & Design</h1>
                    <p className="text-muted-foreground">
                        Choose between a fully customizable standard layout or professionally
                        designed templates.
                    </p>
                </div>
                {user && (
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/${(user as any).slug}`, '_blank')}
                    >
                        {' '}
                        {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Launch Portfolio
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="custom">Custom Design</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Content */}
                    <div
                        className={
                            currentThemeId === 'standard' ? 'lg:col-span-2' : 'lg:col-span-3'
                        }
                    >
                        <TabsContent value="templates" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {availableThemes
                                    .filter(t => t.id !== 'standard')
                                    .map(theme => (
                                        <div
                                            key={theme.id}
                                            className={cn(
                                                'cursor-pointer group relative rounded-xl border-2 overflow-hidden transition-all hover:border-primary/50',
                                                currentThemeId === theme.id
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-transparent',
                                            )}
                                            onClick={() => handleThemeSelect(theme.id)}
                                        >
                                            <div className="aspect-video relative bg-muted">
                                                {/* Placeholder for thumbnail - in real app use theme.thumbnailUrl */}
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted-foreground/10">
                                                    {theme.name} Preview
                                                </div>
                                                {currentThemeId === theme.id && (
                                                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded-full">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 bg-card">
                                                <h3 className="font-semibold">{theme.name}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {theme.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {/* Save Button for Templates */}
                            {currentThemeId !== 'standard' && (
                                <div className="flex justify-end">
                                    <Button onClick={handleSave} size="lg" disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Theme'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-6 mt-0">
                            <div className="border p-6 rounded-xl bg-card space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Standard Customization
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Tailor the standard layout to your brand.
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleReset}>
                                        <RefreshCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>

                                {/* Activation Banner - Outside pointer-events-none container */}
                                {currentThemeId !== 'standard' && (
                                    <div className="bg-primary/10 text-primary p-4 rounded-md text-sm mb-4 flex items-center justify-between">
                                        <span>
                                            Switching to Custom Design will apply the Standard
                                            layout.
                                        </span>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleStandardSelect}
                                        >
                                            Activate Standard Layout
                                        </Button>
                                    </div>
                                )}

                                {/* Controls */}
                                <div
                                    className={cn(
                                        'space-y-6',
                                        currentThemeId !== 'standard' &&
                                            'opacity-50 pointer-events-none',
                                    )}
                                >
                                    {/* Colors */}
                                    <div>
                                        <label className="text-sm font-medium mb-3 flex items-center gap-2">
                                            <Palette className="h-4 w-4" /> Primary Color
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    className={cn(
                                                        'h-10 w-10 rounded-full border-2 transition-transform hover:scale-110',
                                                        customizations.primaryColor === color ||
                                                            (!customizations.primaryColor &&
                                                                currentTheme?.colors.primary ===
                                                                    color)
                                                            ? 'border-foreground ring-2 ring-offset-2 ring-offset-background'
                                                            : 'border-transparent',
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleColorChange(color);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fonts */}
                                    <div>
                                        <label className="text-sm font-medium mb-3 flex items-center gap-2">
                                            <Type className="h-4 w-4" /> Typography
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {FONTS.map(font => (
                                                <button
                                                    key={font}
                                                    className={cn(
                                                        'px-4 py-2 rounded-md border text-sm transition-colors hover:bg-muted',
                                                        customizations.fontFamily === font ||
                                                            (!customizations.fontFamily &&
                                                                currentTheme?.fontFamily === font)
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-input',
                                                    )}
                                                    style={{ fontFamily: font }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleFontChange(font);
                                                    }}
                                                >
                                                    {font}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </div>

                    {/* Right Column: Live Preview (Sticky) - Only for Standard */}
                    {currentThemeId === 'standard' && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-4">
                                <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-4 border-b bg-muted/50 flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                        <div className="h-3 w-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            Live Preview
                                        </span>
                                    </div>
                                    <div
                                        className="p-6 space-y-6 min-h-[400px]"
                                        style={{
                                            fontFamily:
                                                customizations.fontFamily ||
                                                currentTheme?.fontFamily,
                                        }}
                                    >
                                        {/* Mock Portfolio Content */}
                                        <div className="space-y-2 text-center">
                                            <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4" />
                                            <h1 className="text-2xl font-bold">John Doe</h1>
                                            <p className="text-muted-foreground">
                                                Frontend Developer
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                style={{
                                                    backgroundColor:
                                                        customizations.primaryColor ||
                                                        currentTheme?.colors.primary,
                                                }}
                                            >
                                                Contact Me
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Download CV
                                            </Button>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t">
                                            <h3 className="font-semibold text-sm">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {['React', 'Next.js', 'TypeScript'].map(skill => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-1 rounded-md text-xs bg-muted"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSave}
                                    className="w-full"
                                    size="lg"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
