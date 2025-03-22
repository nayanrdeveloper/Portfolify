import React from 'react';
import UserSettingsForm from '@/components/projects/UserSettingsForm';

export default function AdminSettingsPage() {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">User Settings</h1>
            <UserSettingsForm />
        </div>
    );
}
