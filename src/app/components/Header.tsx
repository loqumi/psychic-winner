'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    return (
        <header className="bg-gray-100 dark:bg-gray-900 shadow-sm">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-2xl font-bold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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