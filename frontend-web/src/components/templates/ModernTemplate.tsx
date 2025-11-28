import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

interface ModernTemplateProps {
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
    const { userDetails, skills, projects, socialMedia } = data;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500 selection:text-black">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-8 flex justify-between items-center">
                <div className="text-2xl font-bold text-yellow-500 font-serif italic">
                    {userDetails?.firstName} {userDetails?.lastName}
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a href="#about" className="hover:text-yellow-500 transition-colors">
                        About
                    </a>
                    <a href="#skills" className="hover:text-yellow-500 transition-colors">
                        Skills
                    </a>
                    <a href="#projects" className="hover:text-yellow-500 transition-colors">
                        Projects
                    </a>
                    <a href="#contact" className="hover:text-yellow-500 transition-colors">
                        Contact
                    </a>
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                        Download CV
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-serif italic text-yellow-500">
                        Hello, I&apos;m {userDetails?.firstName}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        I&apos;m a <span className="text-white">Software Engineer</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                        {userDetails?.about ||
                            'with a strong foundation in Web Development and UI/UX Design, focusing on user-centered experiences to deliver highly effective and impactful digital products.'}
                    </p>

                    <div className="pt-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">
                            My Main Skills:
                        </h3>
                        {/* <div className="flex flex-wrap gap-4">
                            {skills?.slice(0, 5).map((skill: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <div key={skill._id} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                    <span className="font-medium">{skill.name}</span>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div>

                <div className="relative flex justify-center md:justify-end">
                    <div className="relative w-80 h-96 md:w-96 md:h-[500px] rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl">
                        {userDetails?.profilePictureUrl ? (
                            <Image
                                src={userDetails.profilePictureUrl}
                                alt="Profile"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Social Sidebar (Desktop) */}
                    <div className="hidden md:flex flex-col gap-6 absolute -right-24 top-1/2 -translate-y-1/2">
                        {socialMedia?.github && (
                            <a href={socialMedia.github} target="_blank" rel="noreferrer">
                                <Github className="w-6 h-6 hover:text-yellow-500 transition-colors" />
                            </a>
                        )}
                        {socialMedia?.linkedin && (
                            <a href={socialMedia.linkedin} target="_blank" rel="noreferrer">
                                <Linkedin className="w-6 h-6 hover:text-yellow-500 transition-colors" />
                            </a>
                        )}
                        {socialMedia?.twitter && (
                            <a href={socialMedia.twitter} target="_blank" rel="noreferrer">
                                <Twitter className="w-6 h-6 hover:text-yellow-500 transition-colors" />
                            </a>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
