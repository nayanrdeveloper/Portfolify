import api from '@/lib/api';
import { ArrowLeft, Calendar, Eye, Tag, User } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ username: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username, slug } = await params;
    try {
        const res = await api.get(`/blogs/${slug}`);
        const blog = res.data.data;
        return {
            title: `${blog.title} | ${username}`,
            description: blog.summary || blog.content.substring(0, 160),
            openGraph: {
                title: blog.title,
                description: blog.summary,
                images: blog.coverImage ? [blog.coverImage] : [],
                type: 'article',
            },
        };
    } catch (error) {
        return {
            title: 'Article Not Found',
        };
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { username, slug } = await params;
    let blog = null;
    let author = null;

    try {
        const [blogRes, userRes] = await Promise.all([
            api.get(`/blogs/${slug}`),
            api.get(`/user-details/slug/${username}`),
        ]);
        blog = blogRes.data.data;
        author = userRes.data.data;
    } catch (error) {
        console.error('Failed to fetch blog post', error);
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center">
                    <Link
                        href={`/${username}`}
                        className="flex items-center text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Portfolio
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 max-w-4xl">
                <article className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {blog.coverImage && (
                        <div className="w-full h-64 md:h-96 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {author.fullName}
                            </div>
                            <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-2" />
                                {blog.views} views
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            {blog.title}
                        </h1>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {blog.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                                    >
                                        <Tag className="w-3 h-3 mr-2" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="prose prose-slate max-w-none lg:prose-lg">
                            <div
                                className="font-serif text-lg leading-relaxed text-slate-700"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
