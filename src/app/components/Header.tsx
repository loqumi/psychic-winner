'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    return (
        <header className="card shadow-sm">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-2xl font-bold text"
                >
                    My Blog
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}