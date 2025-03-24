import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

jest.mock('next/link', () => {
    const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
        <a href={href} {...props}>
            {children}
        </a>
    );
    MockLink.displayName = 'MockLink';
    return MockLink;
});

jest.mock('../components/ThemeToggle', () => {
    const MockThemeToggle = () => <button data-testid="theme-toggle">Toggle Theme</button>;
    MockThemeToggle.displayName = 'MockThemeToggle';
    return MockThemeToggle;
});

describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the header with correct classes', () => {
        render(<Header />);

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('card', 'shadow-sm');

        const nav = screen.getByRole('navigation');
        expect(nav).toHaveClass('container', 'mx-auto', 'px-4', 'py-4', 'flex', 'justify-between', 'items-center');
    });

    it('renders the blog title with a link to the homepage', () => {
        render(<Header />);

        const link = screen.getByRole('link', { name: 'My Blog' });
        expect(link).toHaveAttribute('href', '/');
        expect(link).toHaveClass('text-2xl', 'font-bold', 'text');
        expect(link).toBeInTheDocument();
    });

    it('renders the ThemeToggle component', () => {
        render(<Header />);

        const themeToggle = screen.getByTestId('theme-toggle');
        expect(themeToggle).toBeInTheDocument();
        expect(themeToggle).toHaveTextContent('Toggle Theme');
    });

    it('structures the layout correctly with flexbox', () => {
        render(<Header />);

        const nav = screen.getByRole('navigation');
        const flexContainer = nav.querySelector('div');
        expect(flexContainer).toHaveClass('flex', 'items-center', 'gap-4');

        const link = screen.getByRole('link', { name: 'My Blog' });
        expect(link.parentElement).toBe(nav);

        const themeToggle = screen.getByTestId('theme-toggle');
        expect(themeToggle.parentElement).toBe(flexContainer);
    });
});