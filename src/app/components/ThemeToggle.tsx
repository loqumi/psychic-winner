'use client';
import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

export default function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useThemeStore();

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', darkMode);
    }, [darkMode]);


    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-card text-card-foreground hover:bg-accent transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? '🌞' : '🌙'}
        </button>
    );
}