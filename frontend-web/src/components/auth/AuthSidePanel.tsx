'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "Portfolify helped me land my dream job in weeks! The templates are stunning and easy to customize.",
        author: "Sarah Jenkins",
        role: "Frontend Developer"
    },
    {
        quote: "I built my portfolio in 10 minutes. It's so easy to use and looks professional. Highly recommended!",
        author: "Mike Thompson",
        role: "UX Designer"
    },
    {
        quote: "The SEO features are a game changer. I'm finally getting noticed by recruiters and clients.",
        author: "Emily Rodriguez",
        role: "Full Stack Developer"
    }
];

export default function AuthSidePanel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/90 to-indigo-900/90" />

            <div className="relative z-20 flex items-center text-lg font-medium">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6"
                >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Portfolify
            </div>

            <div className="relative z-20 mt-auto">
                <div className="h-[200px] flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <Quote className="h-8 w-8 text-white/50" />
                            <blockquote className="space-y-2">
                                <p className="text-lg">
                                    &ldquo;{testimonials[current].quote}&rdquo;
                                </p>
                                <footer className="text-sm">
                                    <div className="font-semibold">{testimonials[current].author}</div>
                                    <div className="text-white/60">{testimonials[current].role}</div>
                                </footer>
                            </blockquote>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex gap-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-1.5 rounded-full transition-all ${index === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
