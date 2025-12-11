import { Toaster } from '@/components/ui/toaster';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import ReduxProvider from './providers';

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
            <body className={`${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} antialiased`}>
                <ReduxProvider>
                    {children}
                    <Toaster />
                </ReduxProvider>
            </body>
        </html>
    );
}
