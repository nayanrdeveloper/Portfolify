'use client';

import React from 'react';
import Link from 'next/link';
import { useGetUserDetailsBySlugQuery } from '@/redux/userdetails/userdetailsApi';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function NavBarTemplate1() {
    const { slug } = useParams();
    const { data: detailsData } = useGetUserDetailsBySlugQuery(slug as string);
    return (
        <nav className="bg-[#18181B] text-gray-100 py-4 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Image
                    src={detailsData?.profilePictureUrl || ''}
                    width={56}
                    height={56}
                    alt={detailsData?.title || ''}
                    className="rounded-full object-cover border border-gray-700"
                />

                <span className="font-bold text-lg">{'User'}</span>
            </div>
            <div className="flex items-center space-x-6">
                <Link href="/">
                    <span className="hover:text-blue-400">Home</span>
                </Link>
                <Link href="/projects">
                    <span className="hover:text-blue-400">Projects</span>
                </Link>
                <Link href="/contact">
                    <span className="hover:text-blue-400">Contact Us</span>
                </Link>
                <Link href="/about">
                    <span className="hover:text-blue-400">About</span>
                </Link>
            </div>
        </nav>
    );
}
