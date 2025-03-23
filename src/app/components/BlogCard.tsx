import Link from 'next/link';
import type { Post } from '../types/types';

export default function BlogCard({ post }: { post: Post }) {
    return (
        <article className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                    {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.author}</span>
                    <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString()}
                    </time>
                </div>
            </Link>
        </article>
    );
}