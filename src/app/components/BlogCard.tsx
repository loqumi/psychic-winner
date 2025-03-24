import Link from "next/link";
import { Post } from "@/app/types/types";

export default function BlogCard({ post }: { post: Post }) {
    return (
        <article className="card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
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