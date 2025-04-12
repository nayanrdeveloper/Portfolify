'use client';

import React from 'react';
import { Loader2 } from 'lucide-react'; // from lucide icons

export default function AppLoader({ message }: { message?: string }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center">
            <Loader2 className="h-8 w-8 text-black animate-spin mb-4" />
            <h1 className="text-lg font-semibold text-gray-700">
                {message || 'Loading Portfolify...'}
            </h1>
        </div>
    );
}
