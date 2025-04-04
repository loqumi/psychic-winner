import { Post } from "@/app/types/types";
import { API_URL, IMAGE_URL } from "@/app/utils/apiUtils";

export async function enhancePosts(rawPosts: Post[]): Promise<Post[]> {
    try {
        const userIds = [...new Set(rawPosts.map(post => post.userId))];

        const users = await Promise.all(
            userIds.map(id =>
                fetch(`${API_URL}/users/${id}`)
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch user ${id}`);
                        return res.json();
                    })
            )
        );

        return rawPosts.map(post => {
            const user = users.find(u => u.id === post.userId);
            return {
                ...post,
                slug: generateSlug(post.title),
                excerpt: generateExcerpt(post.body),
                author: user?.name || 'Unknown Author',
                date: generateRandomDate(),
                imageUrl: `${IMAGE_URL}?random=${post.id}`
            };
        });
    } catch (error) {
        console.error("Error enhancing posts:", error);
        throw error;
    }
}

function generateSlug(title: string): string {
    return encodeURIComponent(title.toLowerCase().replace(/ /g, '-'));
}

function generateExcerpt(body: string): string {
    return body.substring(0, 100) + (body.length > 100 ? '...' : '');
}

function generateRandomDate(): string {
    const randomOffset = Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 2);
    return new Date(Date.now() - randomOffset).toISOString();
}

export async function enhancePost(rawPost: Post): Promise<Post> {
    try {
        const user = await fetch(`${API_URL}/users/${rawPost.userId}`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch user ${rawPost.userId}`);
                return res.json();
            });

        return {
            ...rawPost,
            slug: generateSlug(rawPost.title),
            excerpt: generateExcerpt(rawPost.body),
            author: user?.name || 'Unknown Author',
            date: generateRandomDate(),
            imageUrl: `${IMAGE_URL}?random=${rawPost.id}`
        };
    } catch (error) {
        console.error('Error enhancing post:', error);
        throw error;
    }
}