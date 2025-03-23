'use client';

import React from 'react';

/**
 * TemplateTwo - A light-themed portfolio layout with multiple sections:
 * - Profile & GitHub Stats
 * - Featured Projects
 * - Technologies
 * - Experience Timeline
 * - Education
 * - Latest Posts
 * - Hobbies / Languages
 */
export default function TemplateTwo() {
    // Example constants. Replace with your actual data or props.
    const userName = 'Ahmed Oubtbil';
    const userTitle =
        'A Software Engineer based in Morocco, focusing on building enterprise solutions.';
    const avatarUrl = '/avatar.png'; // Replace with actual avatar
    const githubStats = {
        followers: 120,
        following: 50,
        contributions: 487,
        stars: 42,
        languages: 'JavaScript 45%, Python 30%, Others 25%',
    };

    const featuredProjects = [
        {
            id: 1,
            name: 'ecomX portfolio',
            description:
                'A full-stack e-commerce website built with React and Node.js',
            url: '#',
        },
        {
            id: 2,
            name: 'medevs xyz',
            description: 'An AI-based medical platform for teleconsultations',
            url: '#',
        },
    ];

    const technologies = [
        { name: 'React', logo: '/tech/react.png' },
        { name: 'Node.js', logo: '/tech/node.png' },
        { name: 'Python', logo: '/tech/python.png' },
        { name: 'Docker', logo: '/tech/docker.png' },
        { name: 'AWS', logo: '/tech/aws.png' },
        { name: 'MongoDB', logo: '/tech/mongo.png' },
    ];

    const experienceTimeline = [
        {
            id: 1,
            role: 'Full Stack Developer',
            company: 'TechCorp',
            date: '2023 - Present',
            description:
                'Building microservices and front-end apps with React.',
        },
        {
            id: 2,
            role: 'Node.js Developer (Intern)',
            company: 'OpenSource Labs',
            date: '2022 - 2023',
            description: 'Contributed to open-source Node.js frameworks.',
        },
    ];

    const educationTimeline = [
        {
            id: 1,
            degree: 'Vocational Training in Application Development',
            institution: 'ABC Institute',
            date: '2021 - 2022',
        },
        {
            id: 2,
            degree: 'Bachelor in Networks & Telecommunications',
            institution: 'XYZ University',
            date: '2017 - 2021',
        },
    ];

    //   const latestPosts = [
    //     { id: 1, title: "React 18 New Features", link: "#" },
    //     { id: 2, title: "Node.js Streaming and Tutorial", link: "#" },
    //     { id: 3, title: "Deploying Docker Apps on AWS", link: "#" },
    //   ];

    //   const languages = ["English", "French", "Arabic"];
    //   const hobbies = ["Reading", "Music", "Gaming"];

    return (
        <div className="bg-gray-50 text-gray-800 min-h-screen px-4 py-6 md:px-8">
            {/* Header / Profile Section */}
            <section className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">{userName}</h1>
                            <p className="text-sm text-gray-600">{userTitle}</p>
                        </div>
                    </div>
                    {/* GitHub Stats Example */}
                    <div className="mt-4 md:mt-0 grid grid-cols-2 gap-4 md:gap-6 text-center">
                        <div>
                            <p className="text-xl font-semibold">
                                {githubStats.followers}
                            </p>
                            <p className="text-sm text-gray-500">Followers</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold">
                                {githubStats.following}
                            </p>
                            <p className="text-sm text-gray-500">Following</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold">
                                {githubStats.contributions}
                            </p>
                            <p className="text-sm text-gray-500">
                                Contributions
                            </p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold">
                                {githubStats.stars}
                            </p>
                            <p className="text-sm text-gray-500">Stars</p>
                        </div>
                    </div>
                </div>
                {/* Additional Stats / Languages */}
                <div className="mt-4">
                    <p className="text-sm text-gray-500">
                        Language usage: {githubStats.languages}
                    </p>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="max-w-6xl mx-auto mb-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">
                        Featured Projects
                    </h2>
                    <div className="space-y-4">
                        {featuredProjects.map((proj) => (
                            <div key={proj.id} className="border-b pb-4">
                                <h3 className="text-lg font-semibold">
                                    {proj.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {proj.description}
                                </p>
                                {proj.url && (
                                    <a
                                        href={proj.url}
                                        className="text-blue-500 hover:underline text-sm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Project
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="max-w-6xl mx-auto mb-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Technologies</h2>
                    <div className="flex flex-wrap gap-4">
                        {technologies.map((tech) => (
                            <div
                                key={tech.name}
                                className="flex items-center space-x-2"
                            >
                                {/* You can use Next.js Image if you have logos */}
                                <img
                                    src={tech.logo}
                                    alt={tech.name}
                                    className="w-8 h-8 object-contain"
                                />
                                <p className="text-sm font-medium">
                                    {tech.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience & Education */}
            <section className="max-w-6xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Experience</h2>
                    <div className="space-y-4">
                        {experienceTimeline.map((exp) => (
                            <div key={exp.id} className="border-l pl-4">
                                <h3 className="text-lg font-semibold">
                                    {exp.role}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {exp.company}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {exp.date}
                                </p>
                                <p className="text-sm mt-2">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Education */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Education</h2>
                    <div className="space-y-4">
                        {educationTimeline.map((edu) => (
                            <div key={edu.id} className="border-l pl-4">
                                <h3 className="text-lg font-semibold">
                                    {edu.degree}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {edu.institution}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {edu.date}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Posts / Hobbies & Languages */}
            <section className="max-w-6xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Latest Posts */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
                    <div className="space-y-3">
                        <div className="border-b pb-2">
                            <h3 className="text-md font-semibold">
                                React 18 New Features
                            </h3>
                            <p className="text-sm text-blue-500 hover:underline cursor-pointer">
                                Read More
                            </p>
                        </div>
                        <div className="border-b pb-2">
                            <h3 className="text-md font-semibold">
                                Node.js Streaming & Tutorial
                            </h3>
                            <p className="text-sm text-blue-500 hover:underline cursor-pointer">
                                Read More
                            </p>
                        </div>
                        <div>
                            <h3 className="text-md font-semibold">
                                Deploying Docker Apps on AWS
                            </h3>
                            <p className="text-sm text-blue-500 hover:underline cursor-pointer">
                                Read More
                            </p>
                        </div>
                    </div>
                </div>
                {/* Hobbies & Languages */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">More About Me</h2>
                    <div className="mb-4">
                        <h3 className="text-md font-semibold">Languages</h3>
                        <p className="text-sm text-gray-600">
                            English, French, Arabic
                        </p>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold">Hobbies</h3>
                        <p className="text-sm text-gray-600">
                            Reading, Music, Gaming
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto mt-6 text-center text-sm text-gray-500">
                © 2025 {userName}. All rights reserved.
            </footer>
        </div>
    );
}
