'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { useRegisterMutation } from '@/redux/auth/authApi';

export function RegisterForm() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [slug, setSlug] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [register, { isLoading }] = useRegisterMutation();

    async function handleRegisterSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        // Validate that all fields are provided
        if (!fullName || !slug || !email || !password) {
            setError('Please fill in all required fields.');
            return;
        }

        // Validate that password and confirm password match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await register({
                fullName: fullName,
                email,
                password,
                slug,
            }).unwrap();
            // On successful registration, redirect user (e.g. to login page)
            router.push('/auth');
        } catch (err: unknown) {
            console.error('Registration failed:', err);
            setError(
                (err as { data?: { message?: string } })?.data?.message ||
                    'Registration failed.',
            );
        }
    }

    return (
        <form
            onSubmit={handleRegisterSubmit}
            className="space-y-6 max-w-md mx-auto p-6 bg-white rounded shadow"
        >
            {error && (
                <Alert variant="destructive" className="mb-4">
                    {error}
                </Alert>
            )}

            <div>
                <Label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                >
                    Full Name
                </Label>
                <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="mt-1"
                    required
                />
            </div>

            <div>
                <Label
                    htmlFor="slug"
                    className="block text-sm font-medium text-gray-700"
                >
                    Slug
                </Label>
                <Input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="unique-slug"
                    className="mt-1"
                    required
                />
            </div>

            <div>
                <Label
                    htmlFor="registerEmail"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </Label>
                <Input
                    id="registerEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="mt-1"
                    required
                />
            </div>

            <div>
                <Label
                    htmlFor="registerPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </Label>
                <Input
                    id="registerPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a secure password"
                    className="mt-1"
                    required
                />
            </div>

            <div>
                <Label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    Confirm Password
                </Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="mt-1"
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
            </Button>
        </form>
    );
}
