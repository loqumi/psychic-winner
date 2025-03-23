'use client';
import { useState } from 'react';
import BlogCard from './BlogCard';
import { Post } from "@/app/types/types";

export default function BlogList() {
    const [ filteredPosts ] = useState<Post[]>([]);

    return (
        <div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}