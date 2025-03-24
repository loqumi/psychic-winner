import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeStore } from '../stores/themeStore';

import '@testing-library/jest-dom';

jest.mock('../stores/themeStore', () => ({
    useThemeStore: jest.fn(),
}));

describe('ThemeToggle', () => {
    const mockToggleDarkMode = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        document.documentElement.classList.remove('dark');
    });

    it('renders with sun icon when darkMode is true', () => {
        (useThemeStore as unknown as jest.Mock).mockReturnValue({
            darkMode: true,
            toggleDarkMode: mockToggleDarkMode,
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: 'Switch to light mode' });
        expect(button).toBeInTheDocument();

        const sunIcon = screen.getByTestId('sun-icon');
        expect(sunIcon).toBeInTheDocument();
        expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('applies dark class to document root when darkMode is true', () => {
        (useThemeStore as unknown as jest.Mock).mockReturnValue({
            darkMode: true,
            toggleDarkMode: mockToggleDarkMode,
        });

        render(<ThemeToggle />);

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from document root when darkMode is false', () => {
        document.documentElement.classList.add('dark');

        (useThemeStore as unknown as jest.Mock).mockReturnValue({
            darkMode: false,
            toggleDarkMode: mockToggleDarkMode,
        });

        render(<ThemeToggle />);

        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('toggles dark mode when button is clicked', async () => {
        (useThemeStore as unknown as jest.Mock).mockReturnValue({
            darkMode: false,
            toggleDarkMode: mockToggleDarkMode,
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: 'Switch to dark mode' });
        await userEvent.click(button);

        expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
    });
});

beforeAll(() => {
    const originalCreateElement = React.createElement;
    jest.spyOn(React, 'createElement').mockImplementation((type, props, ...children) => {
        if (type === 'svg' && props?.viewBox === '0 0 24 24' && props?.strokeWidth === '1.5') {
            const pathD = props.children?.props?.d || '';
            const testId = pathD.includes('15.002') ? 'moon-icon' : 'sun-icon';
            return originalCreateElement(type, { ...props, 'data-testid': testId }, ...children);
        }
        return originalCreateElement(type, props, ...children);
    });
});

afterAll(() => {
    jest.restoreAllMocks();
});