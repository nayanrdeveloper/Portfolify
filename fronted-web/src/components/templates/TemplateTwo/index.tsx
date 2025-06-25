'use client';

import Image from 'next/image';
import React from 'react';

export default function TemplateTwo() {
    const userName = 'Abhishek Panthee';
    const userTitle = 'A Designer & Developer based in Someplace, Universe.';
    const userSubtitle = 'Focusing on building unique brand identities';
    const avatarUrl = '/avatar.png'; // Replace with actual user avatar or from userDetails
    const summary =
        'Creative Award | #1 design mockups | Helping businesses stand out';

    // Example "tiles" for quick navigation or highlight
    const tiles = [
        {
            title: 'Blog',
            description: 'Check out my writing & tutorials',
            icon: '📰',
            link: '#',
        },
        {
            title: 'Offers',
            description: 'Freelance & consulting available',
            icon: '💼',
            link: '#',
        },
        {
            title: 'Qualifications',
            description: 'Certifications, degrees & more',
            icon: '🎓',
            link: '#',
        },
        {
            title: 'Portfolio',
            description: 'Highlights of my best work',
            icon: '🖼️',
            link: '#',
        },
        {
            title: 'Profiles',
            description: 'Connect with me on social sites',
            icon: '🌐',
            link: '#',
        },
    ];

    // Quick stats or info
    const stats = [
        { label: 'Blog', value: '10+' },
        { label: 'Offers', value: '6+' },
        { label: 'Certifications', value: '12' },
    ];

    return (
        <div className="bg-black text-gray-100 min-h-screen flex flex-col">
            {/* Hero Section */}
            <header className="py-12 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col items-center">
                        {/* Avatar */}
                        <Image
                            src={avatarUrl}
                            width={96}
                            height={96}
                            alt={`User Avatar`}
                            className="rounded-full border-4 border-gray-600 object-cover mb-4"
                        />
                        {/* Name */}
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">
                            {userName}
                        </h1>
                        {/* Title / Subtitle */}
                        <p className="text-lg md:text-xl text-blue-400 font-semibold">
                            {userTitle}
                        </p>
                        <p className="max-w-2xl mt-4 text-gray-300 text-sm">
                            {userSubtitle}
                        </p>
                        <div className="mt-4 bg-gray-800 text-sm text-gray-300 inline-block px-4 py-2 rounded-full">
                            {summary}
                        </div>
                    </div>
                </div>
            </header>

            {/* Tiles Grid Section */}
            <section className="px-6 py-8">
                <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tiles.map((tile) => (
                        <a
                            key={tile.title}
                            href={tile.link}
                            className="bg-[#18181B] rounded-xl p-4 flex flex-col hover:bg-[#242429] transition-colors"
                        >
                            <div className="text-5xl mb-4">{tile.icon}</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-100">
                                {tile.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {tile.description}
                            </p>
                        </a>
                    ))}
                </div>
            </section>

            {/* Stats & CTA Section */}
            <section className="px-6 py-8">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
                    {/* Stats Panel */}
                    <div className="bg-[#18181B] rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-100">
                            Quick Info
                        </h2>
                        <div className="flex space-x-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-3xl font-bold text-blue-400">
                                        {stat.value}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* CTA Panel */}
                    <div className="bg-[#18181B] rounded-xl p-6 flex flex-col items-center justify-center">
                        <h2 className="text-xl font-bold text-gray-100 mb-4">
                            See my CV / Hire Me
                        </h2>
                        <p className="text-gray-300 text-sm text-center mb-4">
                            Ready to take your brand to the next level? Let’s
                            work together!
                        </p>
                        <a
                            href="#"
                            className="bg-blue-600 px-6 py-3 rounded-full text-white hover:bg-blue-500 transition-colors"
                        >
                            View CV
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-[#18181B] py-6 text-center mt-auto">
                <div className="max-w-6xl mx-auto text-gray-500">
                    <p className="mb-2 text-sm">
                        © 2025 {userName}. All rights reserved.
                    </p>
                    <p className="text-sm">
                        Crafted with Next.js & Tailwind CSS
                    </p>
                </div>
            </footer>
        </div>
    );
}
