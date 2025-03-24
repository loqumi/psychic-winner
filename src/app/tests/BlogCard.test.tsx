import React from "react";
import { render, screen } from '@testing-library/react';
import BlogCard from '../components/BlogCard';
import { Post } from '../types/types';

jest.mock('next/link', () => {
    const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
        <a href={href} {...props}>
            {children}
        </a>
    );
    MockLink.displayName = 'MockLink';
    return MockLink;
});

jest.mock('next/image', () => {
    const MockImage = ({ src, alt, fill }: { src: string; alt: string; fill?: boolean }) => (
        <img
            src={src}
            alt={alt}
            style={fill ? { objectFit: 'cover', width: '100%', height: '100%' } : {}}
            data-testid="mocked-image"
        />
    );
    MockImage.displayName = 'MockImage';
    return MockImage;
});

describe('BlogCard', () => {
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
    });

    it('renders all post details correctly', () => {
        render(<BlogCard post={mockPost} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/blog/test-post');

        const image = screen.getByTestId('mocked-image');
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
        expect(image).toHaveAttribute('alt', 'Test Post');
        expect(image).toHaveStyle('object-fit: cover');

        expect(screen.getByText('Test Post')).toBeInTheDocument();
        expect(screen.getByText('A test excerpt')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('1/1/2023')).toBeInTheDocument();
    });

    it('uses placeholder image when imageUrl is undefined', () => {
        const postWithoutImage = { ...mockPost, imageUrl: undefined };
        render(<BlogCard post={postWithoutImage} />);

        const image = screen.getByTestId('mocked-image');
        expect(image).toHaveAttribute('src', '/placeholder.jpg');
        expect(image).toHaveAttribute('alt', 'Test Post');
    });

    it('renders correctly with minimal post data', () => {
        const minimalPost: Post = {
            id: 2,
            title: 'Minimal Post',
            body: '',
            userId: 1,
            slug: 'minimal-post',
            excerpt: '',
            author: 'Jane Doe',
            date: '2023-02-01T00:00:00Z',
        };
        render(<BlogCard post={minimalPost} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/blog/minimal-post');
        expect(screen.getByText('Minimal Post')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('2/1/2023')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-image')).toHaveAttribute('src', '/placeholder.jpg');
    });
});