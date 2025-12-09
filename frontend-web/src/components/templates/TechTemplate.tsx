'use client';

import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronRight,
    Command,
    Database,
    Github,
    Globe,
    Layout,
    Linkedin,
    Mail,
    Server,
    Terminal,
    Twitter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TechTemplateProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export default function TechTemplate({ data }: TechTemplateProps) {
    const {
        userDetails,
        skills,
        projects,
        socialMedia,
        experience,
        education,
        blogs,
    } = data;

    const [activeSection, setActiveSection] = useState('about');
    const [commandInput, setCommandInput] = useState('');
    const [commandOutput, setCommandOutput] = useState<string[]>([]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
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

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = commandInput.trim().toLowerCase();
        let output = `> ${commandInput}`;

        switch (cmd) {
            case 'help':
                output = "Available commands: help, about, skills, works, contact, clear";
                break;
            case 'about':
                scrollToSection('about');
                output = "Navigating to About section...";
                break;
            case 'skills':
                scrollToSection('skills');
                output = "Navigating to Skills section...";
                break;
            case 'works':
                scrollToSection('works');
                output = "Navigating to Works section...";
                break;
            case 'contact':
                scrollToSection('contact');
                output = "Navigating to Contact section...";
                break;
            case 'clear':
                setCommandOutput([]);
                setCommandInput('');
                return;
            default:
                output = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        setCommandOutput([...commandOutput, output]);
        setCommandInput('');
    };

    // Group skills by category if possible, otherwise flat list
    // Assuming backend might not always give strict categories, we'll try to categorize or just list.
    // For this template, we'll just display them in a grid.

    return (
        <div className="min-h-screen bg-[#09090b] text-slate-300 font-mono selection:bg-[#22c55e] selection:text-black">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur border-b border-[#22c55e]/20 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-2 text-[#22c55e] font-bold">
                    <Terminal className="w-5 h-5" />
                    <span>~/{userDetails?.firstName?.toLowerCase()}</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm">
                    {['About', 'Experience', 'Skills', 'Works'].map(item => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className={`hover:text-[#22c55e] transition-colors ${activeSection === item.toLowerCase() ? 'text-[#22c55e]' : ''}`}
                        >
                            <span className="text-[#22c55e] mr-1">./</span>{item}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {/* Client-side only to avoid hydration mismatch */}
                    {typeof window !== 'undefined' && (
                        <PDFDownloadLink
                            document={<ResumeRenderer template={data.resumeTemplate} data={data} />}
                            fileName={`${userDetails?.firstName}_Resume.pdf`}
                        >
                            {({ loading }) => (
                                <button disabled={loading} className="px-4 py-1.5 border border-[#22c55e] text-[#22c55e] text-xs hover:bg-[#22c55e] hover:text-black transition-all font-bold uppercase tracking-wider">
                                    {loading ? '...' : 'Resume'}
                                </button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-6 pt-32 pb-20 space-y-32">

                {/* Hero / About */}
                <section id="about" className="min-h-[60vh] flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 max-w-4xl"
                    >
                        <p className="text-[#22c55e] mb-4">Hello World, I am</p>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                            {userDetails?.fullName}
                        </h1>
                        <h2 className="text-3xl md:text-4xl text-slate-400 font-light">
                            {userDetails?.title}
                        </h2>
                        <p className="text-lg leading-relaxed max-w-2xl border-l-2 border-[#22c55e] pl-6 py-2 text-slate-400">
                            {userDetails?.about || "I build accessible, pixel-perfect, performant, and pretty web experiences."}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {socialMedia?.github && (
                                <Link href={socialMedia.github} target="_blank" className="flex items-center gap-2 hover:text-[#22c55e] transition-colors">
                                    <Github className="w-5 h-5" /> GitHub
                                </Link>
                            )}
                            {socialMedia?.linkedin && (
                                <Link href={socialMedia.linkedin} target="_blank" className="flex items-center gap-2 hover:text-[#22c55e] transition-colors">
                                    <Linkedin className="w-5 h-5" /> LinkedIn
                                </Link>
                            )}
                            {socialMedia?.twitter && (
                                <Link href={socialMedia.twitter} target="_blank" className="flex items-center gap-2 hover:text-[#22c55e] transition-colors">
                                    <Twitter className="w-5 h-5" /> Twitter
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </section>

                {/* Experience - Timeline */}
                <section id="experience">
                    <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-12">
                        <span className="text-[#22c55e]">01.</span> Experience
                        <span className="h-px bg-[#22c55e]/30 flex-1 ml-4"></span>
                    </h3>

                    <div className="space-y-12 border-l border-[#22c55e]/20 ml-3 pl-8 md:pl-12 relative">
                        {experience?.map((job: any, i: number) => (
                            <div key={i} className="relative group">
                                <span className="absolute -left-[41px] md:-left-[57px] top-1.5 h-3 w-3 bg-[#09090b] border border-[#22c55e] group-hover:bg-[#22c55e] transition-colors" />
                                <div className="md:flex items-baseline justify-between mb-2">
                                    <h4 className="text-xl font-bold text-white group-hover:text-[#22c55e] transition-colors">
                                        {job.position} <span className="text-[#22c55e]">@</span> {job.company}
                                    </h4>
                                    <span className="text-sm font-mono text-slate-500">
                                        {new Date(job.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — {job.endDate ? new Date(job.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                                    </span>
                                </div>
                                <p className="text-slate-400 leading-relaxed max-w-2xl">
                                    {job.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills - Grid */}
                <section id="skills">
                    <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-12">
                        <span className="text-[#22c55e]">02.</span> Skills
                        <span className="h-px bg-[#22c55e]/30 flex-1 ml-4"></span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {skills?.map((skill: any) => (
                            <div key={skill._id} className="bg-[#09090b] border border-slate-800 p-4 hover:border-[#22c55e] transition-colors group">
                                <CodeIcon name={skill.name} className="w-8 h-8 mb-4 text-slate-500 group-hover:text-[#22c55e] transition-colors" />
                                <div className="font-bold text-white mb-1 group-hover:text-[#22c55e]">{skill.name}</div>
                                <div className="w-full bg-slate-900 h-1 mt-2">
                                    <div className="bg-[#22c55e] h-1" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects - Cards */}
                <section id="works">
                    <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-12">
                        <span className="text-[#22c55e]">03.</span> Things I've Built
                        <span className="h-px bg-[#22c55e]/30 flex-1 ml-4"></span>
                    </h3>

                    <div className="space-y-24">
                        {projects?.map((project: any, i: number) => (
                            <div key={project._id} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="w-full md:w-1/2 relative group cursor-pointer" onClick={() => handleProjectClick(project)}>
                                    <div className="absolute inset-0 bg-[#22c55e]/20 group-hover:bg-transparent transition-all z-10 block rounded-lg"></div>
                                    <div className="aspect-video relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                                        {project.mediaUrls?.[0] ? (
                                            <Image
                                                src={project.mediaUrls[0]}
                                                alt={project.title}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-slate-700 font-mono">
                                                [NO IMAGE DATA]
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={`w-full md:w-1/2 flex flex-col ${i % 2 !== 0 ? 'md:items-start' : 'md:items-end'} z-20`}>
                                    <p className="text-[#22c55e] font-mono text-sm mb-2">Featured Project</p>
                                    <h4 className="text-2xl font-bold text-white mb-4">{project.title}</h4>

                                    <div className={`bg-[#111113] p-6 rounded-lg border border-slate-800 text-slate-400 text-sm leading-relaxed mb-4 shadow-xl ${i % 2 !== 0 ? 'text-left' : 'md:text-right'}`}>
                                        {project.description}
                                    </div>

                                    <div className={`flex flex-wrap gap-4 text-xs font-mono text-slate-500 mb-6 ${i % 2 !== 0 ? 'justify-start' : 'justify-end'}`}>
                                        {project.technologies?.map((tech: string) => (
                                            <span key={tech}>{tech}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {project.githubUrl && (
                                            <Link href={project.githubUrl} target="_blank" className="text-slate-300 hover:text-[#22c55e] transition-colors">
                                                <Github className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {project.projectUrl && (
                                            <Link href={project.projectUrl} target="_blank" className="text-slate-300 hover:text-[#22c55e] transition-colors">
                                                <Globe className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="max-w-xl mx-auto text-center py-20">
                    <p className="text-[#22c55e] font-mono mb-4">04. What's Next?</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get In Touch</h2>
                    <p className="text-slate-400 mb-12">
                        I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-[#22c55e] blur opacity-20 group-hover:opacity-40 transition-opacity rounded-lg"></div>
                        <a
                            href={`mailto:${userDetails?.email}`}
                            className="relative block px-8 py-4 bg-[#09090b] border border-[#22c55e] text-[#22c55e] font-bold hover:bg-[#22c55e]/10 transition-all rounded-lg"
                        >
                            Say Hello
                        </a>
                    </div>
                </section>

                {/* Terminal Widget */}
                <div className="bg-[#09090b] border border-slate-800 rounded-lg max-w-2xl mx-auto p-4 mb-20 font-mono text-sm opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="h-32 bg-[#09090b] overflow-y-auto custom-scrollbar p-2 text-slate-300 space-y-1">
                        {commandOutput.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                        <form onSubmit={handleCommand} className="flex items-center gap-2">
                            <span className="text-[#22c55e]">visitor@portfolify:~$</span>
                            <input
                                type="text"
                                value={commandInput}
                                onChange={(e) => setCommandInput(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 text-white"
                                placeholder="type help..."
                                spellCheck={false}
                            />
                        </form>
                    </div>
                </div>

            </main>

            <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#22c55e]"></div>
        </div>
    );
}

// Simple helper to pick an icon based on name
function CodeIcon({ name, className }: { name: string; className?: string }) {
    const n = name.toLowerCase();
    if (n.includes('react') || n.includes('next')) return <Layout className={className} />;
    if (n.includes('node') || n.includes('scell') || n.includes('backend')) return <Server className={className} />;
    if (n.includes('database') || n.includes('sql') || n.includes('mongo')) return <Database className={className} />;
    if (n.includes('command') || n.includes('git')) return <Command className={className} />;

    return <Terminal className={className} />;
}
