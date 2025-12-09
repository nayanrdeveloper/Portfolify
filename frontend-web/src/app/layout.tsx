import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import ReduxProvider from './providers';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const playfair = Playfair_Display({
    variable: '--font-playfair-display',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Portfolify - Build Your Dream Portfolio',
    description:
        'The ultimate portfolio generator for developers. Showcase your work with professional themes.',
    icons: {
        icon: '/favicon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
                <ReduxProvider>
                    {children}
                    <Toaster />
                </ReduxProvider>
            </body>
        </html>
    );
}
