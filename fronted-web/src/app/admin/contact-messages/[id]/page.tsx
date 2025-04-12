'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetContactMessageByIDQuery } from '@/redux/contactus/contactusApi';
import FormSkeleton from '@/components/common/FormSkeleton';

export default function ContactMessageDetailPage() {
    const { id } = useParams();
    const { data, isLoading, isError } = useGetContactMessageByIDQuery(
        id as string,
    );

    if (isLoading) return <FormSkeleton fields={2} variant="centered" />;
    if (isError || !data) return <div>Error loading message details.</div>;

    const messageData = data.data;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Message Details</h1>
            <div className="bg-white p-6 rounded shadow">
                <p>
                    <strong>Name:</strong> {messageData.name}
                </p>
                <p>
                    <strong>Email:</strong> {messageData.email || 'N/A'}
                </p>
                <p>
                    <strong>Phone:</strong> {messageData.phone_number || 'N/A'}
                </p>
                <p>
                    <strong>Message:</strong> {messageData.message}
                </p>
                <p>
                    <strong>Date:</strong>{' '}
                    {new Date(messageData.created_at).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
