import BlogList from './components/BlogList';
import { API_URL } from "@/app/utils/apiUtils";
import { enhancePosts } from './utils/postUtils';

async function getInitialPosts() {
    const res = await fetch(`${API_URL}/posts?_page=1&_limit=10`);
    const rawPosts = await res.json();
    return enhancePosts(rawPosts);
}

export default async function Home() {
    const initialPosts = await getInitialPosts();

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
            <BlogList initialPosts={initialPosts} />
        </main>
    );
}