'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLoginMutation } from '@/redux/auth/authApi';
import { useRouter } from 'next/navigation';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [login, { isLoading, isError, error, isSuccess }] =
        useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // RTK Query auto-handles success/failure
            const response = await login({ email, password }).unwrap();
            console.log('Logged in:', response);
            // Optionally store the token in localStorage if not already set
            localStorage.setItem('authToken', response.data.token);
            // Redirect to /admin after successful login
            router.push('/admin');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label
                    htmlFor="loginEmail"
                    className="block text-sm font-semibold mb-1"
                >
                    Email
                </label>
                <input
                    id="loginEmail"
                    type="email"
                    className="w-full px-3 py-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="loginPassword"
                    className="block text-sm font-semibold mb-1"
                >
                    Password
                </label>
                <input
                    id="loginPassword"
                    type="password"
                    className="w-full px-3 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            {isError && (
                <p>
                    Login error:{' '}
                    {(error as { data?: { message?: string } })?.data?.message}
                </p>
            )}
            {isSuccess && <p>Login successful!</p>}
        </form>
    );
}
