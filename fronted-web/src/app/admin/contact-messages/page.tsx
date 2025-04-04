'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
    useGetContactMessagesQuery,
    useDeleteContactMessageMutation,
} from '@/redux/contactus/contactusApi';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function ContactMessagesListPage() {
    const { data, isLoading, isError } = useGetContactMessagesQuery();
    const [deleteContactMessage, { isLoading: isDeleting }] =
        useDeleteContactMessageMutation();

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                await deleteContactMessage(id).unwrap();
                alert('Message deleted successfully.');
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete message.');
            }
        }
    };

    if (isLoading) return <TableSkeleton columns={6} rows={4} />;
    if (isError || !data) return <div>Error loading messages.</div>;

    const messages = Array.isArray(data.data) ? data.data : [];

    return (
        <div className="w-full p-4">
            <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">
                                Email
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Phone
                            </th>
                            <th className="border px-4 py-2 text-left">
                                Message
                            </th>
                            <th className="border px-4 py-2 text-left">Date</th>
                            <th className="border px-4 py-2 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((msg) => (
                            <tr key={msg.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{msg.name}</td>
                                <td className="border px-4 py-2">
                                    {msg.email || 'N/A'}
                                </td>
                                <td className="border px-4 py-2">
                                    {msg.phone_number || 'N/A'}
                                </td>
                                <td className="border px-4 py-2">
                                    {msg.message.slice(0, 50)}...
                                </td>
                                <td className="border px-4 py-2">
                                    {new Date(
                                        msg.created_at,
                                    ).toLocaleDateString()}
                                </td>
                                <td className="border px-4 py-2 flex gap-2">
                                    <Link
                                        href={`/admin/contact-messages/${msg.id}`}
                                    >
                                        <Button variant="secondary" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(msg.id)}
                                        disabled={isDeleting}
                                        className="flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
