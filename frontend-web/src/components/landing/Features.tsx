'use client';

import { motion } from 'framer-motion';
import { LayoutTemplate, MonitorPlay, Palette, UserCircle, Wand2, Zap } from 'lucide-react';

const features = [
    {
        icon: UserCircle,
        title: 'Easy Setup',
        description: 'Create your account and fill in your details in minutes with our user-friendly wizard.',
    },
    {
        icon: MonitorPlay,
        title: 'Real-Time Preview',
        description: 'See changes instantly as you type. No more guessing how your portfolio will look.',
    },
    {
        icon: Palette,
        title: 'Multiple Themes',
        description: 'Choose from a variety of professional themes including Glassmorphism, Neumorphism, and more.',
    },
    {
        icon: Wand2,
        title: 'AI Powered',
        description: 'Let AI generate your bio, project descriptions, and optimize your content for SEO.',
    },
    {
        icon: LayoutTemplate,
        title: 'Customizable',
        description: 'Tweak colors, fonts, and layouts to match your personal brand perfectly.',
    },
    {
        icon: Zap,
        title: 'Fast & Secure',
        description: 'Optimized for performance and SEO. Your portfolio will load fast and look great on any device.',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Portfolify comes packed with powerful features to help you build a stunning portfolio without writing a single line of code.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
