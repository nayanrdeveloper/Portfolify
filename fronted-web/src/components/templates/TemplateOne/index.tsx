'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetUserDetailsBySlugQuery } from '@/redux/userdetails/userdetailsApi';
import { useGetSkillsBySlugQuery } from '@/redux/skills/skillApi';
import { useGetProjectsBySlugQuery } from '@/redux/projects/projectApi';
import ContactFormTemplate1 from './ContactFormTemplate1';

// Helper function to get a fallback value if undefined
const getValue = (value: string | undefined, fallback: string) =>
    value || fallback;

export default function TemplateOne() {
    // Retrieve slug from route parameters
    const { slug } = useParams();

    // Fetch user details based on slug
    const { data: userDetails } = useGetUserDetailsBySlugQuery(slug as string);
    const { data: skills } = useGetSkillsBySlugQuery(slug as string);
    const { data: projects } = useGetProjectsBySlugQuery(slug as string);

    const defaultName = 'Aditya Kumar';
    const defaultTitle =
        'A skilled web developer, crafting cutting-edge applications...';
    const defaultBio =
        'Short introduction about me. Passionate about technology.';
    const defaultAbout =
        'Here you can talk about your experience, background, and goals. Share your journey with your audience.';
    const fullName = getValue(userDetails?.data?.full_name, defaultName);
    const title = getValue(userDetails?.data?.title, defaultTitle);
    const bio = getValue(userDetails?.data?.bio, defaultBio);
    const about = defaultAbout;

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
            <header className="bg-gray-900 py-20 px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    HEY, I aM {fullName.toUpperCase()}
                </h1>
                <p className="text-xl md:text-2xl text-blue-400 font-semibold">
                    {title}
                </p>
                <p className="max-w-3xl mx-auto mt-4 text-gray-300">{bio}</p>
                <div className="mt-8">
                    <a
                        href="#about"
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full"
                    >
                        Learn More
                    </a>
                </div>
            </header>

            <section id="about" className="py-16 px-6 bg-gray-800">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        About Me
                    </h2>
                    <div className="md:flex md:space-x-10">
                        <div className="md:w-1/2">
                            <p className="mb-4 text-gray-300">{about}</p>
                            <p className="mb-4 text-gray-300">{bio}</p>
                        </div>
                        <div className="md:w-1/2 mt-6 md:mt-0">
                            <h3 className="text-xl font-semibold mb-4">
                                My Skills
                            </h3>
                            <ul className="space-y-2">
                                {Array.isArray(skills?.data) &&
                                    skills?.data.map((skill) => (
                                        <li
                                            key={skill.id}
                                            className="inline-block bg-gray-700 rounded-full px-4 py-2 mr-2 mb-2"
                                        >
                                            {skill.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="projects" className="py-16 px-6 bg-gray-900">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        Projects
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {Array.isArray(projects?.data) &&
                            projects.data.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-gray-800 p-4 rounded-lg"
                                >
                                    <h3 className="text-xl font-semibold mb-2">
                                        {project.name}
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        {project.description}
                                    </p>
                                    {project.demo_link && (
                                        <a
                                            href={project.demo_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                        >
                                            View Project
                                        </a>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="py-16 px-6 bg-gray-800 flex-1">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Contact Me
                    </h2>
                    <p className="mb-8 text-gray-300">
                        Please leave a message or any query here. I will respond
                        to your message promptly.
                    </p>
                    <ContactFormTemplate1 slug={slug as string} />
                </div>
            </section>

            <footer className="bg-gray-900 py-6 text-center">
                <div className="max-w-5xl mx-auto text-gray-400">
                    <p className="mb-2">
                        © 2025 {fullName}. All rights reserved.
                    </p>
                    <p>Follow me on social media</p>
                </div>
            </footer>
        </div>
    );
}
