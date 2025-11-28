import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

interface StandardTemplateProps {
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    customization: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function StandardTemplate({ data, customization }: StandardTemplateProps) {
    const { userDetails, skills, projects, socialMedia } = data;
    console.log(data);

    const primaryColor = customization?.primaryColor || '#000000';
    const fontFamily = customization?.fontFamily || 'Inter';

    return (
        <div className="min-h-screen bg-background text-foreground" style={{ fontFamily }}>
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        {userDetails?.fullName} {userDetails?.lastName}
                    </h1>
                    <nav className="flex gap-6 text-sm font-medium">
                        <a href="#about" className="hover:opacity-70">
                            About
                        </a>
                        <a href="#projects" className="hover:opacity-70">
                            Projects
                        </a>
                        <a href="#contact" className="hover:opacity-70">
                            Contact
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section id="about" className="container mx-auto px-6 py-20 text-center max-w-3xl">
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
                    <span style={{ color: primaryColor }}>{userDetails?.fullName}</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    {userDetails?.about}
                </p>
                <div className="flex justify-center gap-4">
                    <Button style={{ backgroundColor: primaryColor }}>View Projects</Button>
                    <Button variant="outline">Contact Me</Button>
                </div>
            </section>

            {/* Skills */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-bold mb-8 text-center">Skills</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {skills?.map(
                            (
                                skill: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                            ) => (
                                <span
                                    key={skill._id}
                                    className="px-4 py-2 rounded-full text-sm font-medium bg-background border shadow-sm"
                                >
                                    {skill.name}
                                </span>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="container mx-auto px-6 py-20">
                <h3 className="text-2xl font-bold mb-8 text-center">Featured Projects</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects?.map(
                        (
                            project: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                        ) => (
                            <div
                                key={project._id}
                                className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-video bg-muted relative">
                                    {project.imageUrl ? (
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold mb-2">{project.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies?.map((tech: string) => (
                                            <span
                                                key={tech}
                                                className="text-xs bg-muted px-2 py-1 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        {project.projectUrl && (
                                            <a
                                                href={project.projectUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm font-medium hover:underline"
                                                style={{ color: primaryColor }}
                                            >
                                                Live Demo
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm font-medium hover:underline"
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted py-12 text-center">
                <div className="flex justify-center gap-6 mb-8">
                    {socialMedia?.github && (
                        <a href={socialMedia.github}>
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {socialMedia?.linkedin && (
                        <a href={socialMedia.linkedin}>
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                    {socialMedia?.twitter && (
                        <a href={socialMedia.twitter}>
                            <Twitter className="w-5 h-5" />
                        </a>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {userDetails?.firstName} {userDetails?.lastName}.
                    All rights reserved.
                </p>
            </footer>
        </div>
    );
}
