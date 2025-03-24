import { create } from 'zustand';
import { Post } from "@/app/types/types";
import { API_URL } from "@/app/utils/apiUtils";
import { enhancePosts } from "@/app/utils/postUtils";

interface BlogStore {
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

export const useBlogStore = create<BlogStore>((set, get) => ({
    posts: [],
    filteredPosts: [],
    searchQuery: '',
    page: 1,
    isLoading: false,
    error: null,

    initializePosts: (initialPosts) => {
        set({
            posts: initialPosts,
            filteredPosts: initialPosts,
            page: 1,
            searchQuery: '',
            error: null
        });
    },

    fetchPosts: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const postsResponse = await fetch(
                `${API_URL}/posts?_page=${page}&_limit=10`
            );
            const rawPosts = await postsResponse.json();

            const enhancedPosts = await enhancePosts(rawPosts);

            set(state => ({
                posts: page === 1 ? enhancedPosts : [...state.posts, ...enhancedPosts],
                filteredPosts: page === 1 ? enhancedPosts : [...state.filteredPosts, ...enhancedPosts],
                page
            }));
        } catch (err) {
            set({ error: `Failed to load posts ${err}` });
        } finally {
            set({ isLoading: false });
        }
    },

    setSearchQuery: (query) => {
        const filtered = get().posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );
        set({ searchQuery: query, filteredPosts: filtered });
    },

    loadMorePosts: async () => {
        const nextPage = get().page + 1;
        await get().fetchPosts(nextPage);
    },
}));