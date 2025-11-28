'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const steps = [
    { name: 'Basic Info', path: '/onboarding/basic' },
    { name: 'Skills', path: '/onboarding/skills' },
    { name: 'Projects', path: '/onboarding/projects' },
    { name: 'Experience', path: '/onboarding/experience' },
    { name: 'Contact', path: '/onboarding/contact' },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAppSelector(state => state.auth);

    const currentStepIndex = steps.findIndex(step => pathname.startsWith(step.path));

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto max-w-5xl px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Let&apos;s get your portfolio ready in just a few steps.
                    </p>
                </div>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="relative flex justify-between">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-muted rounded-full" />

                        {/* Active Progress Bar */}
                        <div
                            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-primary rounded-full transition-all duration-500"
                            style={{
                                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
                            }}
                        />

                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.path} className="relative z-10 flex flex-col items-center">
                                    <div
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors duration-300',
                                            isCompleted && 'border-primary bg-primary text-primary-foreground',
                                            isCurrent && 'border-primary ring-4 ring-primary/20',
                                            !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground'
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <span className="text-sm font-semibold">{index + 1}</span>
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            'absolute -bottom-8 w-32 text-center text-xs font-medium transition-colors duration-300',
                                            isCurrent ? 'text-primary' : 'text-muted-foreground'
                                        )}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Card */}
                <div className="mt-12 rounded-xl border bg-card p-6 shadow-sm md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
