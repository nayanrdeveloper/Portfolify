import { Button } from '@/components/ui/button';
import { Github, GraduationCap, Linkedin, Mail, MapPin, Twitter } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Card, CardTitle } from '../ui/card';

interface ProfessionalTemplateProps {
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
    const { userDetails, skills, projects, socialMedia } = data;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header / Navigation */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="font-bold text-xl text-slate-800 tracking-tight">
                        {userDetails?.firstName}{' '}
                        <span className="text-blue-600">{userDetails?.lastName}</span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                        <a href="#about" className="hover:text-blue-600 transition-colors">
                            Profile
                        </a>
                        <a href="#experience" className="hover:text-blue-600 transition-colors">
                            Experience
                        </a>
                        <a href="#projects" className="hover:text-blue-600 transition-colors">
                            Projects
                        </a>
                        <a href="#contact" className="hover:text-blue-600 transition-colors">
                            Contact
                        </a>
                    </nav>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Download Resume
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 space-y-20">
                {/* Hero Section */}
                <section id="about" className="grid md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg border shadow-sm text-center space-y-6 sticky top-24">
                            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-slate-100">
                                {userDetails?.profilePictureUrl ? (
                                    <Image
                                        src={userDetails.profilePictureUrl}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {userDetails?.fullName}
                                </h1>
                                <p className="text-blue-600 font-medium">
                                    {userDetails?.headLine || 'Professional Title'}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 text-sm text-slate-600 text-left px-4">
                                {userDetails?.location && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{userDetails.location}</span>
                                    </div>
                                )}
                                {userDetails?.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span>{userDetails.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center gap-4 pt-4 border-t">
                                {socialMedia?.linkedin && (
                                    <a
                                        href={socialMedia.linkedin}
                                        className="text-slate-400 hover:text-blue-600"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {socialMedia?.github && (
                                    <a
                                        href={socialMedia.github}
                                        className="text-slate-400 hover:text-slate-900"
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                                {socialMedia?.twitter && (
                                    <a
                                        href={socialMedia.twitter}
                                        className="text-slate-400 hover:text-blue-400"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-12">
                        {/* About */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                About Me
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {userDetails?.about ||
                                    'Experienced professional with a demonstrated history of working in the industry. Skilled in various technologies and committed to delivering high-quality results.'}
                            </p>
                        </section>

                        {/* Skills */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                Professional Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills?.map(
                                    (
                                        skill: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                                    ) => (
                                        <Badge
                                            key={skill._id}
                                            variant="secondary"
                                            className="px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        >
                                            {skill.name}
                                        </Badge>
                                    ),
                                )}
                            </div>
                        </section>

                        {/* Projects */}
                        <section id="projects">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                Featured Projects
                            </h2>
                            <div className="grid gap-6">
                                {projects?.map(
                                    (
                                        project: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                                    ) => (
                                        <Card
                                            key={project._id}
                                            className="overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                <div className="w-full md:w-48 h-48 bg-slate-100 relative shrink-0">
                                                    {project.imageUrl ? (
                                                        <Image
                                                            src={project.imageUrl}
                                                            alt={project.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-slate-400">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6 flex flex-col justify-between w-full">
                                                    <div>
                                                        <CardTitle className="text-xl mb-2">
                                                            {project.title}
                                                        </CardTitle>
                                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                                            {project.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {project.technologies?.map(
                                                                (tech: string) => (
                                                                    <span
                                                                        key={tech}
                                                                        className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border"
                                                                    >
                                                                        {tech}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        {project.projectUrl && (
                                                            <a
                                                                href={project.projectUrl}
                                                                className="text-sm font-medium text-blue-600 hover:underline"
                                                            >
                                                                View Project
                                                            </a>
                                                        )}
                                                        {project.githubUrl && (
                                                            <a
                                                                href={project.githubUrl}
                                                                className="text-sm font-medium text-slate-600 hover:underline"
                                                            >
                                                                Source Code
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ),
                                )}
                            </div>
                        </section>

                        {/* Certificates & Awards */}
                        {data.achievements && data.achievements.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                    Certificates & Awards
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {data.achievements.map(
                                        (
                                            achievement: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                                        ) => (
                                            <Card
                                                key={achievement._id}
                                                className="overflow-hidden hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex">
                                                    <div className="w-32 h-32 bg-slate-100 relative shrink-0">
                                                        {achievement.mediaUrl ? (
                                                            <Image
                                                                src={achievement.mediaUrl}
                                                                alt={achievement.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                                <GraduationCap className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4 flex flex-col justify-between w-full">
                                                        <div>
                                                            <h3 className="font-semibold text-lg line-clamp-1">
                                                                {achievement.name}
                                                            </h3>
                                                            <p className="text-blue-600 text-sm font-medium">
                                                                {achievement.issuer}
                                                            </p>
                                                            <p className="text-slate-500 text-xs mt-1">
                                                                Issued:{' '}
                                                                {new Date(
                                                                    achievement.issueDate,
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {achievement.credentialURL && (
                                                            <a
                                                                href={achievement.credentialURL}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-sm text-slate-600 hover:text-blue-600 hover:underline mt-2 inline-block"
                                                            >
                                                                Verify Credential
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ),
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
                <p>
                    &copy; {new Date().getFullYear()} {userDetails?.firstName}{' '}
                    {userDetails?.lastName}. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
