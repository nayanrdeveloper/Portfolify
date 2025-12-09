'use client';

import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
    ArrowUpRight,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Twitter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface EditorialTemplateProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export default function EditorialTemplate({ data }: EditorialTemplateProps) {
    const {
        userDetails,
        skills,
        projects,
        socialMedia,
        experience,
        education,
        blogs,
    } = data;

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleProjectClick = async (project: any) => {
        try {
            await api.post(`/analytics/track/project/${project._id}`);
            if (project.projectUrl) window.open(project.projectUrl, '_blank');
        } catch (error) {
            console.error('Failed to track project click', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-[#FDE047] selection:text-slate-900">
            {/* Top Bar Navigation */}
            <header className="border-b-4 border-slate-900 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                    <div className="font-[family-name:var(--font-playfair-display)] text-2xl font-bold tracking-tight">
                        {userDetails?.firstName}
                        <span className="text-[#FDE047]">.</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide uppercase">
                        {['About', 'Work', 'Writing'].map(item => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className="hover:underline decoration-[#FDE047] decoration-4 underline-offset-4 transition-all"
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    {/* Client-side only to avoid hydration mismatch */}
                    {typeof window !== 'undefined' && (
                        <PDFDownloadLink
                            document={<ResumeRenderer template={data.resumeTemplate} data={data} />}
                            fileName={`${userDetails?.firstName}_Resume.pdf`}
                        >
                            {({ loading }) => (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                    className="border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                                >
                                    {loading ? '...' : 'Resume'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section id="about" className="bg-[#FDE047] border-b-4 border-slate-900 py-20 lg:py-32">
                <div className="container mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="font-[family-name:var(--font-playfair-display)] text-6xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                            Level up your <br />
                            <span className="bg-white px-2 decoration-4 underline decoration-slate-900 underline-offset-8">
                                {userDetails?.title?.split(' ')[0] || 'Digital'}
                            </span>
                            <br /> skills
                        </h1>
                        <p className="text-xl lg:text-2xl font-medium max-w-xl border-l-4 border-slate-900 pl-6 py-2">
                            {userDetails?.about || "I build accessible, pixel-perfect, performant, and pretty web experiences."}
                        </p>

                        <div className="flex gap-4 pt-4">
                            {socialMedia?.github && (
                                <Link href={socialMedia.github} target="_blank">
                                    <div className="p-3 bg-slate-900 text-white hover:bg-white hover:text-slate-900 border-2 border-slate-900 transition-colors">
                                        <Github className="w-6 h-6" />
                                    </div>
                                </Link>
                            )}
                            {socialMedia?.linkedin && (
                                <Link href={socialMedia.linkedin} target="_blank">
                                    <div className="p-3 bg-slate-900 text-white hover:bg-white hover:text-slate-900 border-2 border-slate-900 transition-colors">
                                        <Linkedin className="w-6 h-6" />
                                    </div>
                                </Link>
                            )}
                            <Link href={`mailto:${userDetails?.email}`}>
                                <Button className="h-auto py-3 px-8 text-lg font-bold bg-white text-slate-900 border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square relative border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                            {userDetails?.profilePictureUrl ? (
                                <Image
                                    src={userDetails.profilePictureUrl}
                                    alt={userDetails.fullName}
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                    <span className="font-[family-name:var(--font-playfair-display)] text-9xl font-bold opacity-10">
                                        {userDetails?.firstName?.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Marquee / Skills Section */}
            <div className="border-b-4 border-slate-900 bg-slate-900 text-[#FDE047] py-4 overflow-hidden">
                <div className="flex gap-8 animate-infinite-scroll whitespace-nowrap font-mono font-bold uppercase tracking-wider">
                    {skills?.map((skill: any, i: number) => (
                        <span key={i} className="flex items-center gap-8">
                            {skill.name} <span className="text-white">★</span>
                        </span>
                    ))}
                    {skills?.map((skill: any, i: number) => (
                        <span key={`dup-${i}`} className="flex items-center gap-8">
                            {skill.name} <span className="text-white">★</span>
                        </span>
                    ))}
                </div>
            </div>

            <main className="container mx-auto px-4 lg:px-6 py-20 space-y-32">

                {/* Featured Projects - Newspaper Grid */}
                <section id="work">
                    <div className="flex items-baseline justify-between mb-8 border-b-4 border-slate-900 pb-2">
                        <h2 className="font-[family-name:var(--font-playfair-display)] text-4xl lg:text-5xl font-black">
                            Featured Works
                        </h2>
                        <span className="bg-slate-900 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
                            Selected
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects?.map((project: any, i: number) => (
                            <div
                                key={project._id}
                                onClick={() => handleProjectClick(project)}
                                className={`group border-4 border-slate-900 bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer flex flex-col ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                            >
                                <div className="aspect-video relative border-2 border-slate-900 mb-6 overflow-hidden bg-slate-100">
                                    {project.mediaUrls?.[0] ? (
                                        <Image
                                            src={project.mediaUrls[0]}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono">
                                            // NO_IMAGE
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {project.technologies?.slice(0, 2).map((tech: string) => (
                                            <span key={tech} className="bg-[#FDE047] border-2 border-slate-900 px-2 py-1 text-xs font-bold uppercase">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <h3 className="font-[family-name:var(--font-playfair-display)] text-2xl font-bold mb-3 group-hover:underline decoration-4 decoration-[#FDE047]">
                                    {project.title}
                                </h3>
                                <p className="text-slate-600 mb-6 line-clamp-3 font-medium flex-1">
                                    {project.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide border-t-2 border-slate-100 pt-4 mt-auto">
                                    View Project <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest Content - List Layout */}
                {blogs && blogs.length > 0 && (
                    <section id="writing">
                        <div className="flex items-baseline justify-between mb-8 border-b-4 border-slate-900 pb-2">
                            <h2 className="font-[family-name:var(--font-playfair-display)] text-4xl lg:text-5xl font-black">
                                Latest Writing
                            </h2>
                        </div>

                        <div className="space-y-0 border-t-4 border-slate-900">
                            {blogs.map((blog: any) => (
                                <Link key={blog._id} href={`/`} className="block group">
                                    <article className="grid md:grid-cols-[250px_1fr_auto] gap-8 items-start py-8 border-b-2 border-slate-200 hover:bg-[#FDFBF7] transition-colors">
                                        <div className="text-slate-500 font-mono text-sm pt-1">
                                            {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div>
                                            <h3 className="font-[family-name:var(--font-playfair-display)] text-2xl font-bold mb-2 group-hover:text-[#D97706] transition-colors">
                                                {blog.title}
                                            </h3>
                                            <p className="text-slate-600 line-clamp-2 max-w-2xl">
                                                {blog.summary || blog.content.substring(0, 150) + "..."}
                                            </p>
                                        </div>
                                        <div className="bg-slate-100 p-2 rounded-full group-hover:bg-[#FDE047] group-hover:border-2 group-hover:border-slate-900 transition-all">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience & Education - Two Column Grid */}
                <section className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    <div>
                        <h3 className="font-[family-name:var(--font-playfair-display)] text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center text-sm">01</span>
                            Experience
                        </h3>
                        <div className="space-y-8 border-l-2 border-slate-900 ml-4 pl-8 relative">
                            {experience?.map((job: any, i: number) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[39px] top-1 w-5 h-5 bg-[#FDE047] border-2 border-slate-900 rounded-full" />
                                    <h4 className="font-bold text-lg">{job.position}</h4>
                                    <div className="text-slate-600 font-medium mb-1">{job.company}</div>
                                    <div className="text-sm font-mono text-slate-500 mb-2">
                                        {new Date(job.startDate).getFullYear()} — {job.endDate ? new Date(job.endDate).getFullYear() : 'Present'}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-[family-name:var(--font-playfair-display)] text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center text-sm">02</span>
                            Education
                        </h3>
                        <div className="space-y-8 border-l-2 border-slate-900 ml-4 pl-8 relative">
                            {education?.map((edu: any, i: number) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[39px] top-1 w-5 h-5 bg-white border-2 border-slate-900 rounded-full" />
                                    <h4 className="font-bold text-lg">{edu.degree}</h4>
                                    <div className="text-slate-600 font-medium mb-1">{edu.institution}</div>
                                    <div className="text-sm font-mono text-slate-500">
                                        {new Date(edu.startDate).getFullYear()} — {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - The Index Style */}
            <footer className="bg-[#F3F0E8] border-t-4 border-slate-900">
                <div className="container mx-auto px-4 lg:px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-end">
                        <div className="space-y-6">
                            <h2 className="font-[family-name:var(--font-playfair-display)] text-8xl lg:text-9xl font-black leading-none tracking-tighter -ml-1">
                                The End.
                            </h2>
                            <p className="text-xl font-medium max-w-md">
                                Thanks for stopping by. Join thousands of subscribers (just kidding) and drop me a line.
                            </p>

                            <div className="flex flex-col gap-2 pt-4">
                                {userDetails?.email && (
                                    <a href={`mailto:${userDetails.email}`} className="flex items-center gap-3 font-bold text-lg hover:text-[#D97706]">
                                        <Mail className="w-5 h-5" /> {userDetails.email}
                                    </a>
                                )}
                                {userDetails?.location && (
                                    <span className="flex items-center gap-3 font-medium text-slate-600">
                                        <MapPin className="w-5 h-5" /> {userDetails.location}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="lg:text-right space-y-8">
                            <div className="flex lg:justify-end gap-4">
                                {socialMedia?.twitter && (
                                    <Link href={socialMedia.twitter} className="font-mono uppercase tracking-widest hover:bg-[#FDE047]">Twitter</Link>
                                )}
                                {socialMedia?.type === 'LinkedIn' && (
                                    <Link href={socialMedia.url} className="font-mono uppercase tracking-widest hover:bg-[#FDE047]">LinkedIn</Link>
                                )}
                            </div>

                            <div className="inline-block p-8 bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm text-left">
                                <h4 className="font-bold text-lg mb-2">Short. Digestible. Curated.</h4>
                                <p className="text-slate-600 text-sm mb-4">
                                    I don't actually have a newsletter, but if I did, it would be awesome.
                                </p>
                                <form className="flex">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 bg-slate-100 border-2 border-r-0 border-slate-900 px-3 py-2 text-sm focus:outline-none"
                                        disabled
                                    />
                                    <Button disabled className="rounded-none border-2 border-slate-900 bg-[#FDE047] text-slate-900 font-bold hover:bg-[#FCD34D]">
                                        Join
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-8 border-t-2 border-slate-300 flex justify-between items-center text-sm font-mono text-slate-500">
                        <p>&copy; {new Date().getFullYear()} {userDetails?.fullName}.</p>
                        <p>Built with Portfolify</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
