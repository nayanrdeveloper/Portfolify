'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert'; // optional: ensure you have an Alert component
import { useLoginMutation } from '@/redux/auth/authApi';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const router = useRouter();
    const [login, { isLoading, isError, isSuccess }] = useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        try {
            await login({ email, password }).unwrap(); // returns string token
            router.push('/admin');
        } catch (err) {
            setLocalError(
                typeof err === 'object' && err !== null && 'message' in err
                    ? (err as Error).message
                    : 'An unknown error occurred.',
            );
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

            {isError && localError && (
                <Alert variant="destructive" className="mb-4">
                    {localError}
                </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <Label
                        htmlFor="loginEmail"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </Label>
                    <Input
                        id="loginEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label
                        htmlFor="loginPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </Label>
                    <Input
                        id="loginPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="mt-1"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                {isSuccess && (
                    <p className="text-green-600 text-center mt-2">
                        Login successful!
                    </p>
                )}
            </form>
        </div>
    );
}
