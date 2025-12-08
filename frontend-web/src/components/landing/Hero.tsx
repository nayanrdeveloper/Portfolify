'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px] filter" />
                <div className="absolute top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px] filter" />
                <div className="absolute bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-pink-500/20 blur-[100px] filter" />
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-300 mb-6 backdrop-blur-sm"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>Build your dream portfolio in minutes</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
                    >
                        Showcase your work with{' '}
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                            Portfolify
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                    >
                        The ultimate portfolio generator for developers. Choose a theme, fill in
                        your details, and get a professional portfolio website instantly.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex flex-col gap-4 sm:flex-row"
                    >
                        <Link
                            href="/signup"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Create your Portfolify
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link
                            href="/#features"
                            className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 px-8 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Explore Features
                        </Link>
                    </motion.div>

                    {/* Portfolio Preview Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1, delay: 0.4, type: 'spring' }}
                        className="mt-20 w-full max-w-5xl"
                    >
                        <div className="relative rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/20">
                            {/* Browser Header */}
                            <div className="absolute top-0 left-0 right-0 h-10 border-b bg-muted/50 rounded-t-lg flex items-center px-4 gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                <div className="h-3 w-3 rounded-full bg-green-400" />
                                <div className="ml-4 h-6 w-1/2 rounded-md bg-muted/50" />
                            </div>

                            {/* Content Placeholder */}
                            <div className="mt-10 aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                                <div className="text-center z-10">
                                    <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 animate-pulse mb-6 shadow-xl" />
                                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                        Your Amazing Portfolio
                                    </h3>
                                    <p className="text-muted-foreground mt-2">Built with Portfolify</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
