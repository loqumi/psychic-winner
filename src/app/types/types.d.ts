export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    slug: string;
    excerpt: string;
    author: string;
    date: string;
    imageUrl?: string;
}