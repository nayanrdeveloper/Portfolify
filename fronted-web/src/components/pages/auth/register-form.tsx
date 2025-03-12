'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Optional: use an alert component from shadcn/ui if available
import { Alert } from '@/components/ui/alert';

export function RegisterForm() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleRegisterSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        // Client-side validation: check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Replace with an API call to your registration endpoint
            // Example:
            // const res = await fetch("/api/auth/register", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ fullName, email, password }),
            // });
            // if (!res.ok) throw new Error("Registration failed");
            // const data = await res.json();

            // For demonstration, we use an alert:
            alert('Registered successfully (placeholder)!');
            // Optionally, redirect the user after successful registration
            router.push('/auth');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
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
