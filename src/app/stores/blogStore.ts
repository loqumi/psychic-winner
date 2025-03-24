import { create } from 'zustand';
import { BlogState } from "@/app/types/types";
import { enhancePosts } from "@/app/utils/postUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useBlogStore = create<BlogState>((set, get) => ({
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