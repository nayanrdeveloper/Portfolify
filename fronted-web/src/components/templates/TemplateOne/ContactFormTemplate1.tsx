'use client';

import React, { useState } from 'react';
import { useCreateContactMessageMutation } from '@/redux/contactus/contactusApi';

interface ContactFormProps {
    slug: string;
}

export default function ContactFormTemplate1({ slug }: ContactFormProps) {
    const [createContactMessage] = useCreateContactMessageMutation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createContactMessage({
                slug,
                name,
                email,
                phone_number: phoneNumber,
                message,
            }).unwrap();
            alert('Message sent successfully!');
            setName('');
            setEmail('');
            setPhoneNumber('');
            setMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Failed to send message.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
                <label className="block text-gray-300 mb-2" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-gray-300 mb-2" htmlFor="phone">
                    Phone
                </label>
                <input
                    id="phone"
                    type="phone"
                    className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-gray-300 mb-2" htmlFor="message">
                    Message
                </label>
                <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </div>
            <button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full"
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
