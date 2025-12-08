'use client';

import AuthSidePanel from '@/components/auth/AuthSidePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/features/auth/authSlice';
import { RegisterFormData, registerSchema } from '@/features/auth/schema';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
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
            {/* Visual Side Panel */}
            <AuthSidePanel />

            {/* Signup Form Section */}
            <div className="relative flex h-full items-center justify-center p-8 bg-background overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-purple-500/5 blur-[80px]" />
                <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]"
                >
                    <div className="flex flex-col space-y-2 text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-xl opacity-20 rounded-full" />
                                <Image
                                    src="/logo.png"
                                    alt="Portfolify"
                                    width={180}
                                    height={50}
                                    className="h-12 w-auto relative z-10"
                                    priority
                                />
                            </div>
                        </motion.div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Create an account
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your details to start building your portfolio
                        </p>
                    </div>

                    <div className="grid gap-6 p-8 rounded-xl border bg-card/50 shadow-lg backdrop-blur-sm">
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
                                        className="h-11 bg-background/50"
                                        {...register('fullName')}
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-red-500 animate-in slide-in-from-left-1">
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
                                        className="h-11 bg-background/50"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 animate-in slide-in-from-left-1">
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
                                        className="h-11 bg-background/50"
                                        {...register('slug')}
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-red-500 animate-in slide-in-from-left-1">
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
                                        className="h-11 bg-background/50"
                                        {...register('password')}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500 animate-in slide-in-from-left-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    disabled={isLoading}
                                    className="h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="hover:text-purple-600 transition-colors underline underline-offset-4"
                        >
                            Already have an account? Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
