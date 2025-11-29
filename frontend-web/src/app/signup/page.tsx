'use client';

import AuthSidePanel from '@/components/auth/AuthSidePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/features/auth/authSlice';
import { RegisterFormData, registerSchema } from '@/features/auth/schema';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function SignupPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error, isAuthenticated, user } = useAppSelector(state => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
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

    const onSubmit = async (data: RegisterFormData) => {
        await dispatch(registerUser(data));
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
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        type="text"
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...register('fullName')}
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-red-500">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>
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
                                    <Label htmlFor="slug">Username (Optional)</Label>
                                    <Input
                                        id="slug"
                                        placeholder="john-doe"
                                        type="text"
                                        autoCapitalize="none"
                                        autoComplete="username"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...register('slug')}
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-red-500">
                                            {errors.slug.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
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
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            Already have an account? Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
