'use client';
import { useEffect } from 'react';
import BlogCard from './BlogCard';
import SearchBar from './SearchBar';
import { Post } from "@/app/types/types";
import { useBlogStore } from '../stores/blogStore';

interface BlogListProps {
    initialPosts?: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const {
        filteredPosts,
        loadMorePosts,
        initializePosts,
        fetchPosts,
        searchQuery
    } = useBlogStore();

    useEffect(() => {
        if (initialPosts) {
            initializePosts(initialPosts);
            if (initialPosts.length === 0) {
                fetchPosts();
            }
        }
    }, [initialPosts, initializePosts, fetchPosts]);

    return (
        <div>
            <SearchBar />
            {filteredPosts.length > 0 ? (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                    {!searchQuery && (
                        <button
                            onClick={loadMorePosts}
                            className="mt-8 button px-6 py-2 rounded hover:opacity-90"
                        >
                            Load More
                        </button>
                    )}
                </>
            ) : (
                <h1>No posts found.</h1>
            )}
        </div>
    );
}