'use client';

import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
    ArrowUpRight,
    Briefcase,
    Calendar,
    ExternalLink,
    Github,
    GraduationCap,
    Linkedin,
    Mail,
    MapPin,
    Twitter,
    User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProfessionalTemplateProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export default function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
    const {
        userDetails,
        skills,
        projects,
        socialMedia,
        experience,
        education,
        blogs,
        achievements,
    } = data;
    console.log(experience);
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);

    const handleProjectClick = async (project: any) => {
        setSelectedProject(project);
        try {
            await api.post(`/analytics/track/project/${project._id}`);
        } catch (error) {
            console.error('Failed to track project click', error);
        }
    };

    const handleBlogClick = async (blog: any) => {
        setSelectedBlog(blog);
        try {
            await api.post(`/analytics/track/article/${blog._id}`);
        } catch (error) {
            console.error('Failed to track article read', error);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="text-xl font-bold tracking-tighter">
                        {userDetails?.fullName}
                        <span className="text-blue-600">.</span>
                    </div>
                    <div className="hidden gap-6 md:flex">
                        {['About', 'Experience', 'Projects', 'Articles', 'Contact'].map(item => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <Button
                        onClick={() => window.print()}
                        variant="outline"
                        size="sm"
                        className="hidden md:flex"
                    >
                        Print
                    </Button>

                    {/* Client-side only to avoid hydration mismatch with PDFDownloadLink */}
                    {typeof window !== 'undefined' && (
                        <PDFDownloadLink
                            document={<ResumeRenderer template={data.resumeTemplate} data={data} />}
                            fileName={`${userDetails?.firstName}_${userDetails?.lastName}_Resume.pdf`}
                        >
                            {({ loading }) => (
                                <Button size="sm" disabled={loading}>
                                    {loading ? 'Generating...' : 'Download Resume'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </nav>

            <main className="container mx-auto px-4 md:px-6">
                {/* Hero Section */}
                <section id="about" className="py-20 md:py-32">
                    <div className="grid gap-12 md:grid-cols-2 md:items-center">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <Badge variant="secondary" className="w-fit text-blue-600">
                                    Available for hire
                                </Badge>
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                    Hi, I&apos;m {userDetails?.fullName} <br />
                                    <span className="text-blue-600">{userDetails?.lastName}</span>
                                </h1>
                                <p className="max-w-[600px] text-lg text-slate-600 md:text-xl/relaxed">
                                    {userDetails?.title || 'Professional Developer & Designer'}
                                </p>
                            </div>
                            <p className="max-w-[600px] text-slate-600">
                                {userDetails?.about ||
                                    'I build accessible, pixel-perfect, performant, and pretty web experiences.'}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {socialMedia?.github && (
                                    <Link href={socialMedia.github} target="_blank">
                                        <Button variant="outline" size="icon">
                                            <Github className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                                {socialMedia?.linkedin && (
                                    <Link href={socialMedia.linkedin} target="_blank">
                                        <Button variant="outline" size="icon">
                                            <Linkedin className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                                {socialMedia?.twitter && (
                                    <Link href={socialMedia.twitter} target="_blank">
                                        <Button variant="outline" size="icon">
                                            <Twitter className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                                <Link href={`mailto:${userDetails?.email}`}>
                                    <Button className="gap-2">
                                        <Mail className="h-4 w-4" /> Contact Me
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative mx-auto aspect-square w-full max-w-[400px] overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
                            {userDetails?.profilePictureUrl ? (
                                <Image
                                    src={userDetails.profilePictureUrl}
                                    alt={userDetails.fullName}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-300">
                                    <User className="h-32 w-32" />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Experience & Education */}
                <section id="experience" className="py-20">
                    <div className="grid gap-12 md:grid-cols-2">
                        {/* Experience */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
                            </div>
                            <div className="relative space-y-8 border-l-2 border-slate-200 pl-8">
                                {experience?.map((job: any, i: number) => (
                                    <div key={i} className="relative">
                                        <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600" />
                                        <div className="space-y-2">
                                            <h3 className="font-bold leading-none">
                                                {job.position}
                                            </h3>
                                            <div className="text-sm font-medium text-slate-600">
                                                {job.company}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                                                {job.endDate
                                                    ? new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                                    : 'Present'}
                                            </div>
                                            <p className="text-sm text-slate-600">
                                                {job.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {!experience?.length && (
                                    <p className="text-slate-500">No experience listed.</p>
                                )}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Education</h2>
                            </div>
                            <div className="relative space-y-8 border-l-2 border-slate-200 pl-8">
                                {education?.map((edu: any, i: number) => (
                                    <div key={i} className="relative">
                                        <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600" />
                                        <div className="space-y-2">
                                            <h3 className="font-bold leading-none">{edu.degree}</h3>
                                            <div className="text-sm font-medium text-slate-600">
                                                {edu.institution}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                                                {edu.endDate
                                                    ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                                    : 'Present'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!education?.length && (
                                    <p className="text-slate-500">No education listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section className="py-12">
                    <div className="rounded-2xl bg-slate-50 p-8 md:p-12">
                        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
                            Technical Skills
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {skills?.map((skill: any) => (
                                <Badge
                                    key={skill._id}
                                    variant="secondary"
                                    className="bg-white px-4 py-2 text-sm shadow-sm transition-transform hover:scale-105"
                                >
                                    {skill.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section id="projects" className="py-20">
                    <div className="mb-12 flex items-end justify-between">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
                            <p className="text-slate-600">A collection of my best work.</p>
                        </div>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects?.map((project: any) => (
                            <Card
                                key={project._id}
                                className="group flex flex-col overflow-hidden border-0 bg-slate-50 shadow-sm transition-all hover:shadow-lg cursor-pointer"
                                onClick={() => handleProjectClick(project)}
                            >
                                <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                                    {project.mediaUrls?.[0] ? (
                                        <Image
                                            src={project.mediaUrls[0]}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {project.technologies?.slice(0, 3).map((tech: string) => (
                                            <Badge
                                                key={tech}
                                                variant="outline"
                                                className="border-slate-200 bg-white text-xs"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="line-clamp-3 text-sm text-slate-600">
                                        {project.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="gap-2 border-t bg-white p-4">
                                    <Button className="w-full gap-2" size="sm" variant="outline">
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Articles */}
                {blogs && blogs.length > 0 && (
                    <section id="articles" className="py-20">
                        <div className="mb-12 space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
                            <p className="text-slate-600">
                                Thoughts on technology and development.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {blogs.map((blog: any) => (
                                <Card
                                    key={blog._id}
                                    className="group h-full overflow-hidden border-0 shadow-sm transition-all hover:shadow-lg cursor-pointer"
                                    onClick={() => handleBlogClick(blog)}
                                >
                                    <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-100">
                                        {blog.coverImage ? (
                                            <Image
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">
                                                <div className="text-4xl font-bold text-slate-200">
                                                    Aa
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                        <CardTitle className="line-clamp-2 group-hover:text-blue-600">
                                            {blog.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-3 text-sm text-slate-600">
                                            {blog.summary || blog.content.substring(0, 100) + '...'}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                                            Read Article <ArrowUpRight className="h-4 w-4" />
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {achievements && achievements.length > 0 && (
                    <section className="py-20">
                        <h2 className="mb-12 text-3xl font-bold tracking-tight">Achievements</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {achievements.map((item: any) => (
                                <Card key={item._id} className="flex items-center gap-4 p-4">
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                        {item.mediaUrl ? (
                                            <Image
                                                src={item.mediaUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Award className="h-8 w-8 text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-sm text-slate-600">{item.issuer}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(item.issueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer id="contact" className="bg-slate-950 py-12 text-slate-400">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-12 md:grid-cols-3">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">
                                {userDetails?.firstName} {userDetails?.lastName}
                            </h3>
                            <p className="text-sm leading-relaxed">
                                Thank you for visiting my portfolio. I&apos;m always open to new
                                opportunities and collaborations.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Contact</h3>
                            <div className="space-y-2 text-sm">
                                {userDetails?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <a
                                            href={`mailto:${userDetails.email}`}
                                            className="hover:text-white"
                                        >
                                            {userDetails.email}
                                        </a>
                                    </div>
                                )}
                                {userDetails?.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{userDetails.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Social</h3>
                            <div className="flex gap-4">
                                {socialMedia?.github && (
                                    <Link
                                        href={socialMedia.github}
                                        target="_blank"
                                        className="hover:text-white"
                                    >
                                        <Github className="h-5 w-5" />
                                    </Link>
                                )}
                                {socialMedia?.linkedin && (
                                    <Link
                                        href={socialMedia.linkedin}
                                        target="_blank"
                                        className="hover:text-white"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </Link>
                                )}
                                {socialMedia?.twitter && (
                                    <Link
                                        href={socialMedia.twitter}
                                        target="_blank"
                                        className="hover:text-white"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <Separator className="my-8 bg-slate-800" />
                    <div className="flex flex-col items-center justify-between gap-4 text-xs md:flex-row">
                        <p>
                            &copy; {new Date().getFullYear()} {userDetails?.firstName}{' '}
                            {userDetails?.lastName}. All rights reserved.
                        </p>
                        <p>Built with Portfolify</p>
                    </div>
                </div>
            </footer>

            {/* Project Modal */}
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedProject?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedProject?.technologies?.join(', ')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {selectedProject?.mediaUrls?.[0] && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                                <Image
                                    src={selectedProject.mediaUrls[0]}
                                    alt={selectedProject.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap text-slate-600">
                                {selectedProject?.description}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        {selectedProject?.githubUrl && (
                            <Link href={selectedProject.githubUrl} target="_blank">
                                <Button variant="outline" className="gap-2">
                                    <Github className="h-4 w-4" /> Source Code
                                </Button>
                            </Link>
                        )}
                        {selectedProject?.projectUrl && (
                            <Link href={selectedProject.projectUrl} target="_blank">
                                <Button className="gap-2">
                                    <ExternalLink className="h-4 w-4" /> Live Demo
                                </Button>
                            </Link>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Blog Modal */}
            <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Calendar className="h-4 w-4" />
                            {selectedBlog && new Date(selectedBlog.createdAt).toLocaleDateString()}
                        </div>
                        <DialogTitle className="text-2xl">{selectedBlog?.title}</DialogTitle>
                        <DialogDescription>{selectedBlog?.tags?.join(', ')}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {selectedBlog?.coverImage && (
                            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-slate-100">
                                <Image
                                    src={selectedBlog.coverImage}
                                    alt={selectedBlog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div
                            className="prose max-w-none text-slate-800"
                            dangerouslySetInnerHTML={{ __html: selectedBlog?.content || '' }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function Award(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
    );
}
