'use client';

import { motion } from 'framer-motion';
import { LayoutTemplate, MonitorPlay, Palette, UserCircle, Wand2, Zap } from 'lucide-react';

const features = [
    {
        icon: UserCircle,
        title: 'Easy Setup',
        description:
            'Create your account and fill in your details in minutes with our user-friendly wizard.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        icon: MonitorPlay,
        title: 'Real-Time Preview',
        description:
            'See changes instantly as you type. No more guessing how your portfolio will look.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        icon: Palette,
        title: 'Multiple Themes',
        description:
            'Choose from a variety of professional themes including Glassmorphism, Neumorphism, and more.',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
    },
    {
        icon: Wand2,
        title: 'AI Powered',
        description:
            'Let AI generate your bio, project descriptions, and optimize your content for SEO.',
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
    },
    {
        icon: LayoutTemplate,
        title: 'Customizable',
        description: 'Tweak colors, fonts, and layouts to match your personal brand perfectly.',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    },
    {
        icon: Zap,
        title: 'Fast & Secure',
        description:
            'Optimized for performance and SEO. Your portfolio will load fast and look great on any device.',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4"
                    >
                        Features
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Everything you need to succeed
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Portfolify comes packed with powerful features to help you build a stunning
                        portfolio without writing a single line of code.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-6 shadow-inner`}>
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
