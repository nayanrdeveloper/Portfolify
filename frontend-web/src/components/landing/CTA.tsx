'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-20 text-center shadow-2xl sm:px-12 sm:py-24 lg:px-16"
                >
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            Ready to showcase your work?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of developers who have built their professional
                            portfolios with Portfolify. Start for free today.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
                        >
                            Get Started for Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-[80px] animate-pulse" />
                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-[80px]" />
                </motion.div>
            </div>
        </section>
    );
}
