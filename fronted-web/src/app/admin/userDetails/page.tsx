'use client';

import UserDetailsForm from '@/components/projects/UserDetailsForm';
import React from 'react';

export default function AdminUserDetailsPage() {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My User Details</h1>
            <UserDetailsForm />
        </div>
    );
}
