'use client';

import { Button } from '@/components/ui/button';
import { loginUser } from '@/features/auth/authSlice';
import { LoginFormData, loginSchema } from '@/features/auth/schema';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AuthSidePanel from '@/components/auth/AuthSidePanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error, isAuthenticated, user } = useAppSelector(state => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.isOnboardingCompleted) {
                router.push('/dashboard');
            } else {
                router.push('/onboarding/basic');
            }
        }
    }, [isAuthenticated, user, router]);

    const onSubmit = async (data: LoginFormData) => {
        await dispatch(loginUser(data));
    };

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <AuthSidePanel />
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/logo.png"
                                alt="Portfolify"
                                width={180}
                                height={50}
                                className="h-10 w-auto"
                                priority
                            />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-medium text-primary hover:text-primary/90"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        {...register('password')}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                                        {error}
                                    </div>
                                )}

                                <Button disabled={isLoading}>
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/signup"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            Don&apos;t have an account? Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
