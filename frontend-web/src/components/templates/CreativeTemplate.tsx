import { Button } from '@/components/ui/button';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

interface CreativeTemplateProps {
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
    const { userDetails, socialMedia } = data;

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6">
                <div className="bg-white rounded-full px-8 py-4 shadow-sm flex justify-between items-center">
                    <div className="font-bold text-lg text-green-500">
                        {userDetails?.firstName} {userDetails?.lastName}
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#about" className="hover:text-green-500 transition-colors">
                            About
                        </a>
                        <a href="#experience" className="hover:text-green-500 transition-colors">
                            Experience
                        </a>
                        <a href="#skills" className="hover:text-green-500 transition-colors">
                            Skills
                        </a>
                        <a href="#projects" className="hover:text-green-500 transition-colors">
                            Projects
                        </a>
                        <a href="#contact" className="hover:text-green-500 transition-colors">
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-white rounded-3xl p-12 shadow-sm min-h-[500px] flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold">Hey! I&apos;m</h2>
                        <h1 className="text-5xl md:text-6xl font-bold text-green-500">
                            {userDetails?.firstName} {userDetails?.lastName}.
                        </h1>
                        <p className="text-xl text-gray-600">
                            {userDetails?.headLine || 'a Computer Science Undergraduate'}
                        </p>

                        <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-6 text-lg">
                            Contact
                        </Button>

                        <div className="flex gap-4 pt-8">
                            {socialMedia?.github && (
                                <a
                                    href={socialMedia.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {socialMedia?.linkedin && (
                                <a
                                    href={socialMedia.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {socialMedia?.twitter && (
                                <a
                                    href={socialMedia.twitter}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {socialMedia?.instagram && (
                                <a
                                    href={socialMedia.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative h-[500px] flex items-center justify-center">
                    {/* Placeholder for Illustration - In a real app, this would be a dynamic illustration or the user's image styled differently */}
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-green-100 rounded-full opacity-20 transform scale-90 translate-x-10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Using profile picture as fallback for illustration */}
                            {userDetails?.profilePictureUrl ? (
                                <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-xl relative">
                                    <Image
                                        src={userDetails.profilePictureUrl}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="text-green-800 font-bold text-2xl">
                                    [Illustration Placeholder]
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
