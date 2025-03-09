'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleRegisterSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // TODO: Replace with a real API call to /api/auth/register (example)
            // const res = await fetch("/api/auth/register", { method: "POST", ... })
            // if (!res.ok) throw new Error("Registration failed")
            // const data = await res.json()

            // For demonstration:
            alert('Registered successfully (placeholder)!');
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
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            <div>
                <label
                    htmlFor="registerEmail"
                    className="block text-sm font-semibold mb-1"
                >
                    Email
                </label>
                <input
                    id="registerEmail"
                    type="email"
                    className="w-full px-3 py-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="registerPassword"
                    className="block text-sm font-semibold mb-1"
                >
                    Password
                </label>
                <input
                    id="registerPassword"
                    type="password"
                    className="w-full px-3 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
            </Button>
        </form>
    );
}
