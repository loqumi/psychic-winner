import React from 'react';
import Image from 'next/image';
import { Post } from "../../types/types";
import { notFound } from 'next/navigation';
import imageLoader from "../../image/loader";
import { API_URL } from "../../utils/apiUtils";
import { enhancePost } from "../../utils/postUtils";

export async function generateStaticParams() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts: Post[] = await response.json();

        return posts.map((post) => ({
            slug: encodeURIComponent(post.title.toLowerCase().replace(/ /g, '-')),
        }));
    } catch (error) {
        console.error('Failed to fetch posts for static params:', error);
        return [];
    }
}

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function getPost(slug: string): Promise<Post | null> {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const allPosts = await response.json();
        const rawPost = allPosts.find((p: Post) =>
            encodeURIComponent(p.title.toLowerCase().replace(/ /g, '-')) === slug
        );

        if (!rawPost) return null;

        return await enhancePost(rawPost);
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
    }
}

export default async function BlogPost({ params }: PageProps) {
    const resolvedParams = await params;
    const post = await getPost(resolvedParams.slug);

    if (!post) notFound();

    return (
        <article className="max-w-3xl mx-auto py-12 px-4 text">
            {post.imageUrl && (
                <div className="mb-8 rounded-lg overflow-hidden">
                    <Image
                        loader={imageLoader}
                        src={post.imageUrl}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full h-auto object-cover image-fade"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                </div>
            )}
            <h1 className="text-5xl font-bold mb-4 ">{post.title}</h1>
            <div className="flex items-center gap-4 mb-8">
                <span className="font-medium">{post.author}</span>
                <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </time>
            </div>
            <div className="prose dark:prose-invert max-w-none">
                {post.body}
            </div>
        </article>
    );
}