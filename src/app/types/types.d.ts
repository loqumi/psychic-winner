export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    slug: string;
    excerpt: string;
    author: string;
    date: string;
}

export interface BlogState {
    posts: Post[];
    filteredPosts: Post[];
    searchQuery: string;
    page: number;
    isLoading: boolean;
    error: string | null;
    initializePosts: (posts: Post[]) => void;
    fetchPosts: (page?: number) => Promise<void>;
    setSearchQuery: (query: string) => void;
    loadMorePosts: () => Promise<void>;
}