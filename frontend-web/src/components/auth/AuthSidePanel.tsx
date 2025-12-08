'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
    {
        quote: 'Portfolify helped me land my dream job in weeks! The templates are stunning and easy to customize.',
        author: 'Sarah Jenkins',
        role: 'Frontend Developer',
    },
    {
        quote: "I built my portfolio in 10 minutes. It's so easy to use and looks professional. Highly recommended!",
        author: 'Mike Thompson',
        role: 'UX Designer',
    },
    {
        quote: "The SEO features are a game changer. I'm finally getting noticed by recruiters and clients.",
        author: 'Emily Rodriguez',
        role: 'Full Stack Developer',
    },
];

export default function AuthSidePanel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative hidden h-full flex-col bg-zinc-900 text-white dark:border-r lg:flex overflow-hidden">
            {/* Animated Mesh Gradients */}
            <div className="absolute top-[-20%] left-[-20%] h-[600px] w-[600px] rounded-full bg-purple-600/30 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] h-[600px] w-[600px] rounded-full bg-blue-600/30 blur-[100px] animate-pulse" />
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-3xl" />

            {/* Content Container */}
            <div className="relative z-20 flex h-full flex-col p-10">
                <div className="flex items-center text-lg font-bold tracking-tight">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    Portfolify
                </div>

                <div className="mt-auto">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                        <div className="relative z-10">
                            <Quote className="h-8 w-8 text-purple-400 mb-6" />

                            <div className="h-[140px] flex flex-col justify-between">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={current}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <blockquote className="space-y-4">
                                            <p className="text-xl font-medium leading-relaxed tracking-wide text-gray-100">
                                                &ldquo;{testimonials[current].quote}&rdquo;
                                            </p>
                                        </blockquote>
                                    </motion.div>
                                </AnimatePresence>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={current}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    >
                                        <footer className="mt-4 flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center font-bold text-sm">
                                                {testimonials[current].author[0]}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{testimonials[current].author}</div>
                                                <div className="text-sm text-gray-400">{testimonials[current].role}</div>
                                            </div>
                                        </footer>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Indicators */}
                            <div className="mt-8 flex gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === current
                                                ? 'w-8 bg-purple-400'
                                                : 'w-2 bg-white/20 hover:bg-white/40'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
