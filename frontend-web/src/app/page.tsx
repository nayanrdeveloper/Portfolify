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
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Portfolify. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
