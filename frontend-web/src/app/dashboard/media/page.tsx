'use client';

import { MediaLibrary } from '@/components/media/MediaLibrary';

export default function MediaPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Media Library</h1>
                <p className="text-slate-500 mt-2">Manage your images and assets.</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
                <MediaLibrary mode="manage" />
            </div>
        </div>
    );
}
