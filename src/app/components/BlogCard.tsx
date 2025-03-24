import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Post } from "../types/types";
import imageLoader from "../image/loader";

export default function BlogCard({ post }: { post: Post }) {
    return (
        <article className="card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                        loader={imageLoader}
                        src={post.imageUrl || '/placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover image-fade"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={post.id <= 3}
                    />
                </div>

                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm">
                    <span>{post.author}</span>
                    <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString()}
                    </time>
                </div>
            </Link>
        </article>
    );
}