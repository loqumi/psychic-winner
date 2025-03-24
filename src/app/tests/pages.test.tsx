import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPost, { generateStaticParams, getPost } from '../blog/[slug]/page';
import { notFound } from 'next/navigation';
import { API_URL } from '../utils/apiUtils';
import { enhancePost } from '../utils/postUtils';
import { Post } from '../types/types';

jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

jest.mock('../utils/postUtils', () => ({
    enhancePost: jest.fn((post: Post) => Promise.resolve({ ...post, enhanced: true })),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    // eslint-disable-next-line @next/next/no-img-element
    default: ({ src, alt, width, height }: { src: string; alt: string; width?: number; height?: number }) => (
        <img src={src} alt={alt} width={width} height={height} data-testid="mocked-image" />
    ),
}));

describe('BlogPost Page', () => {
    const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        body: 'This is a test post.',
        userId: 1,
        slug: 'test-post',
        excerpt: 'A test excerpt',
        author: 'John Doe',
        date: '2023-01-01T00:00:00Z',
        imageUrl: 'https://example.com/image.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers(),
                redirected: false,
                statusText: 'OK',
                type: 'basic' as const,
                url: '',
                clone: () => ({} as Response),
                body: null,
                bodyUsed: false,
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                blob: () => Promise.resolve(new Blob()),
                formData: () => Promise.resolve(new FormData()),
                json: () => Promise.resolve([] as Post[]),
                text: () => Promise.resolve(''),
            } as Response)
        );
    });

    describe('generateStaticParams', () => {
        it('should return an array of slug params from posts', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve([mockPost]),
            } as Response);

            const params = await generateStaticParams();
            expect(params).toEqual([{ slug: encodeURIComponent('test-post') }]);
            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/posts`);
        });

        it('should handle fetch errors gracefully', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

            const params = await generateStaticParams();
            expect(params).toEqual([]);
        });
    });

    describe('getPost', () => {
        it('should fetch and enhance a post by slug', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve([mockPost]),
            } as Response);

            const post = await getPost(encodeURIComponent('test-post'));
            expect(post).toEqual({ ...mockPost, enhanced: true });
            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/posts`);
            expect(enhancePost).toHaveBeenCalledWith(mockPost);
        });

        it('should return null if post is not found', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve([mockPost]),
            } as Response);

            const post = await getPost('non-existent-slug');
            expect(post).toBeNull();
        });

        it('should return null on fetch error', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            const post = await getPost('test-post');
            expect(post).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch post:', expect.any(Error));
            consoleErrorSpy.mockRestore();
        });
    });

    describe('BlogPost Component', () => {
        it('should render post details correctly', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve([mockPost]),
            } as Response);

            const params = { slug: encodeURIComponent('test-post') };
            render(await BlogPost({ params: Promise.resolve(params) }));

            expect(screen.getByText('Test Post')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
            expect(screen.getByText('This is a test post.')).toBeInTheDocument();
            expect(screen.getByTestId('mocked-image')).toHaveAttribute(
                'src',
                'https://example.com/image.jpg'
            );
            expect(screen.getByTestId('mocked-image')).toHaveAttribute('alt', 'Test Post');
            expect(screen.getByTestId('mocked-image')).toHaveAttribute('width', '800');
            expect(screen.getByTestId('mocked-image')).toHaveAttribute('height', '400');
        });

        it('should call notFound when post is not found', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve([] as Post[]),
            } as Response);

            const params = { slug: 'non-existent-slug' };
            await expect(BlogPost({ params: Promise.resolve(params) })).rejects.toThrow();
            expect(notFound).toHaveBeenCalled();
        });
    });
});