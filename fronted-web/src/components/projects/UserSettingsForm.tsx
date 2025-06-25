'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    useGetUserSettingsBySlugQuery,
    useUpdateUserSettingsMutation,
} from '@/redux/settings/settingsApi';
import { useAppSelector } from '@/redux/hooks';
import FormSkeleton from '../common/FormSkeleton';

export default function UserSettingsForm() {
    // Fetch settings using user slug (public endpoint)
    const { slug, userId } = useAppSelector((state) => state.auth.userProfile);
    const {
        data: settings,
        isLoading,
        error,
    } = useGetUserSettingsBySlugQuery(slug);
    const [updateUserSettings, { isLoading: isUpdating }] =
        useUpdateUserSettingsMutation();

    const [selectedTemplate, setSelectedTemplate] = useState<string>('default');

    useEffect(() => {
        if (settings) {
            console.log('settings', settings);
            setSelectedTemplate(settings.template);
        }
    }, [settings]);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTemplate(e.target.value);
    };

    const handleSave = async () => {
        try {
            await updateUserSettings({
                id: userId,
                template: selectedTemplate,
            }).unwrap();
            // Optionally display success feedback here (e.g., toast)
        } catch (err) {
            console.error('Failed to update settings:', err);
            // Optionally display error feedback here
        }
    };

    if (isLoading) return <FormSkeleton fields={2} variant="centered" />;
    if (error) return <p>Error loading settings</p>;

    return (
        <div className="space-y-4 p-4 border rounded">
            <Label
                htmlFor="template-select"
                className="block text-sm font-medium text-gray-700"
            >
                Select Template
            </Label>
            <select
                id="template-select"
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="mt-1 block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option value="default">Default</option>
                <option value="theme1">Template 1</option>
                <option value="theme2">Template 2</option>
            </select>
            {isUpdating && (
                <p className="text-sm text-gray-600">Updating settings...</p>
            )}
            <Button
                onClick={handleSave}
                variant="default"
                className="mt-4"
                disabled={isUpdating}
            >
                Save Settings
            </Button>
        </div>
    );
}
