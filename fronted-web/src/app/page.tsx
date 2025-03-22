import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            {/* NAVBAR (Local to Landing Page) */}
            <header className="border-b border-b-accent py-4">
                <nav className="max-w-6xl mx-auto flex items-center justify-between px-4">
                    <div className="text-xl font-bold">Portfolify</div>
                    <div className="space-x-4">
                        <Link href="/auth" className="hover:underline">
                            Login
                        </Link>
                        <Link href="/auth" className="hover:underline">
                            Sign Up
                        </Link>
                        <Link href="/admin" className="hover:underline">
                            Admin
                        </Link>
                    </div>
                </nav>
            </header>

            {/* MAIN CONTENT */}
            <div className="flex-1">
                {/* HERO SECTION */}
                <section className="flex flex-col items-center justify-center px-6 py-12 text-center gap-6 max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Build Your Portfolio in 5 Minutes
                    </h1>
                    <p className="text-lg text-muted-foreground sm:text-xl">
                        Showcase your work effortlessly with Portfolify.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <Link href="/signup">
                            <Button variant="default" size="lg">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg">
                                Log In
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl w-full mx-auto px-6 py-12">
                    <div className="p-6 flex flex-col items-center text-center bg-card rounded-md shadow-sm">
                        <Badge variant="secondary" className="mb-3">
                            Easy Setup
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">
                            Start Quickly
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Our intuitive wizard guides you from zero to a live
                            portfolio in just minutes.
                        </p>
                    </div>
                    <div className="p-6 flex flex-col items-center text-center bg-card rounded-md shadow-sm">
                        <Badge variant="secondary" className="mb-3">
                            Customization
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">
                            Pick Your Style
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Choose from multiple templates, themes, and
                            layouts—no coding required!
                        </p>
                    </div>
                    <div className="p-6 flex flex-col items-center text-center bg-card rounded-md shadow-sm">
                        <Badge variant="secondary" className="mb-3">
                            Performance
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">
                            Powered by Next.js
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Enjoy blazing-fast load times, SEO benefits, and
                            built-in security features.
                        </p>
                    </div>
                </section>

                {/* OPTIONAL TESTIMONIAL SECTION */}
                <section className="max-w-3xl mx-auto text-center px-6 py-12 space-y-4">
                    <h2 className="text-2xl font-bold">
                        Loved by Creators Worldwide
                    </h2>
                    <p className="text-muted-foreground">
                        Thousands of designers, developers, and freelancers
                        trust Portfolify.
                    </p>
                    <div className="mt-6">
                        <Image
                            src="/images/testimonials.png"
                            alt="Testimonials"
                            width={600}
                            height={300}
                            className="mx-auto"
                        />
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="text-center space-y-4 py-12">
                    <h2 className="text-2xl font-bold">
                        Ready to create your portfolio?
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Sign up now and get your website live in just 5 minutes.
                    </p>
                    <Link href="/signup">
                        <Button variant="default" size="lg">
                            Get Started
                        </Button>
                    </Link>
                </section>
            </div>

            {/* FOOTER (Local to Landing Page) */}
            <footer className="border-t border-t-accent text-center py-4 text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Portfolify. All rights
                reserved.
            </footer>
        </main>
    );
}
