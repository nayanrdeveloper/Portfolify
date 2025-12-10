'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import api from '@/lib/api';
import {
    ArrowUpRight,
    Award,
    Briefcase,
    Calendar,
    ExternalLink,
    Github,
    GraduationCap,
    Linkedin,
    MapPin,
    Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface StandardTemplateProps {
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    customization: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function StandardTemplate({
    data,
    customization,
}: StandardTemplateProps) {
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
    const primaryColor = customization?.primaryColor || '#000000';
    const fontFamily = customization?.fontFamily || 'Inter';

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
        <div
            className="min-h-screen bg-background text-foreground"
            style={{ fontFamily }}
        >
            {/* Header */}
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        {userDetails?.fullName} {userDetails?.lastName}
                    </h1>
                    <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <a href="#about" className="hover:opacity-70">
                            About
                        </a>
                        {experience?.length > 0 && <a href="#experience" className="hover:opacity-70">Experience</a>}
                        {projects?.length > 0 && <a href="#projects" className="hover:opacity-70">Projects</a>}
                        {blogs?.length > 0 && <a href="#articles" className="hover:opacity-70">Articles</a>}
                        <a href="#contact" className="hover:opacity-70">
                            Contact
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section
                id="about"
                className="container mx-auto px-6 py-20 text-center max-w-3xl"
            >
                {userDetails?.profilePictureUrl && (
                    <div
                        className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden relative border-4"
                        style={{ borderColor: primaryColor }}
                    >
                        <Image
                            src={userDetails?.profilePictureUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                )}
                <h2 className="text-4xl font-bold mb-4">
                    Hi, I&apos;m{' '}
                    <span style={{ color: primaryColor }}>
                        {userDetails?.fullName}
                    </span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    {userDetails?.about}
                </p>
                <div className="flex justify-center gap-4">
                    <Button style={{ backgroundColor: primaryColor }} className="text-white hover:opacity-90">
                        View Projects
                    </Button>
                    <Button variant="outline">Contact Me</Button>
                </div>
            </section>

            {/* Experience & Education */}
            {(experience?.length > 0 || education?.length > 0) && (
                <section id="experience" className="bg-muted/30 py-20">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
                        {/* Experience */}
                        {experience?.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
                                    Experience
                                </h3>
                                <div className="space-y-8 border-l-2 border-muted pl-8 ml-2">
                                    {experience.map((job: any) => (
                                        <div key={job._id} className="relative">
                                            <span
                                                className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-background"
                                                style={{ backgroundColor: primaryColor }}
                                            />
                                            <h4 className="font-bold text-lg">{job.position}</h4>
                                            <div className="font-medium mb-1" style={{ color: primaryColor }}>
                                                {job.company}
                                            </div>
                                            <div className="text-sm text-muted-foreground mb-4">
                                                {new Date(job.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -{' '}
                                                {job.endDate ? new Date(job.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present'}
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {job.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {education?.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
                                    Education
                                </h3>
                                <div className="space-y-8 border-l-2 border-muted pl-8 ml-2">
                                    {education.map((edu: any) => (
                                        <div key={edu._id} className="relative">
                                            <span
                                                className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-background"
                                                style={{ backgroundColor: primaryColor }}
                                            />
                                            <h4 className="font-bold text-lg">{edu.degree}</h4>
                                            <div className="font-medium mb-1" style={{ color: primaryColor }}>
                                                {edu.institution}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(edu.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -{' '}
                                                {edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Skills */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-bold mb-8 text-center">Skills</h3>
                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                        {skills?.map((skill: any) => (
                            <span
                                key={skill._id}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-background border shadow-sm hover:shadow-md transition-shadow"
                                style={{ borderColor: primaryColor }}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects */}
            {projects?.length > 0 && (
                <section id="projects" className="bg-muted/30 py-20">
                    <div className="container mx-auto px-6">
                        <h3 className="text-2xl font-bold mb-8 text-center">
                            Featured Projects
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project: any) => (
                                <Card
                                    key={project._id}
                                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-none"
                                    onClick={() => handleProjectClick(project)}
                                >
                                    <div className="aspect-video bg-muted relative group">
                                        {project.mediaUrls?.[0] ? (
                                            <Image
                                                src={project.mediaUrls[0]}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-200">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6">
                                        <h4 className="font-bold mb-2 text-lg">{project.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 3).map((tech: string) => (
                                                <Badge
                                                    key={tech}
                                                    variant="secondary"
                                                    className="bg-muted text-muted-foreground font-normal"
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {project.technologies?.length > 3 && (
                                                <span className="text-xs text-muted-foreground flex items-center">+{project.technologies.length - 3} more</span>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 flex gap-3">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Articles */}
            {blogs?.length > 0 && (
                <section id="articles" className="py-20">
                    <div className="container mx-auto px-6">
                        <h3 className="text-2xl font-bold mb-8 text-center">
                            Latest Articles
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {blogs.map((blog: any) => (
                                <Card
                                    key={blog._id}
                                    className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all border-none"
                                    onClick={() => handleBlogClick(blog)}
                                >
                                    <div className="aspect-[2/1] relative bg-muted overflow-hidden">
                                        {blog.coverImage ? (
                                            <Image
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                <span className="text-4xl text-slate-300 font-bold">Aa</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                        <h4 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                                            {blog.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {blog.summary || blog.content.substring(0, 100)}...
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0">
                                        <span className="text-sm font-medium flex items-center gap-1" style={{ color: primaryColor }}>
                                            Read Article <ArrowUpRight className="w-4 h-4" />
                                        </span>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements */}
            {achievements?.length > 0 && (
                <section className="bg-muted/30 py-20">
                    <div className="container mx-auto px-6">
                        <h3 className="text-2xl font-bold mb-8 text-center">Achievements</h3>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {achievements.map((item: any) => (
                                <Card key={item._id} className="flex items-center gap-4 p-4 border-none shadow-sm">
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                                        {item.mediaUrl ? (
                                            <Image
                                                src={item.mediaUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Award className="w-8 h-8 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">{item.issuer}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(item.issueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer id="contact" className="bg-slate-900 text-slate-300 py-12 text-center">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center gap-6 mb-8">
                        {socialMedia?.github && (
                            <a href={socialMedia.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                <Github className="w-6 h-6" />
                            </a>
                        )}
                        {socialMedia?.linkedin && (
                            <a href={socialMedia.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        )}
                        {socialMedia?.twitter && (
                            <a href={socialMedia.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                        )}
                    </div>
                    {userDetails?.email && (
                        <p className="mb-4 text-slate-400">
                            Say hello at <a href={`mailto:${userDetails.email}`} className="text-white hover:underline">{userDetails.email}</a>
                        </p>
                    )}
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} {userDetails?.firstName}{' '}
                        {userDetails?.lastName}. All rights reserved.
                    </p>
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
                            <p className="whitespace-pre-wrap text-foreground">
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
                                <Button className="gap-2" style={{ backgroundColor: primaryColor }}>
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
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
                            className="prose max-w-none text-foreground"
                            dangerouslySetInnerHTML={{ __html: selectedBlog?.content || '' }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
