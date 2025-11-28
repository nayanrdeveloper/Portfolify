import CTA from '@/components/landing/CTA';
import Features from '@/components/landing/Features';
import Hero from '@/components/landing/Hero';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Hero />
            <Features />
            <CTA />

            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            {/* We can't use Image here easily if we don't import it, but we can import it at top */}
                            <span className="text-xl font-bold text-primary">Portfolify</span>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-foreground">Privacy Policy</a>
                            <a href="#" className="hover:text-foreground">Terms of Service</a>
                            <a href="#" className="hover:text-foreground">Contact</a>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Portfolify. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
