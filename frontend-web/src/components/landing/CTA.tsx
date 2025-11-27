'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center shadow-2xl sm:px-12 sm:py-24 lg:px-16">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-6">
                            Ready to showcase your work?
                        </h2>
                        <p className="text-lg text-primary-foreground/80 mb-10">
                            Join thousands of developers who have built their professional portfolios with Portfolify. Start for free today.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-background px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Get Started for Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>
            </div>
        </section>
    );
}
