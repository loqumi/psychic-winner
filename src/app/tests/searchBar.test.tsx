import React, {act} from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';
import { useBlogStore } from '../stores/blogStore';

jest.mock('../stores/blogStore', () => ({
    useBlogStore: jest.fn(),
}));

jest.mock('punycode', () => ({}), { virtual: true });

jest.mock('use-debounce', () => ({
    useDebounce: (value: string) => [value],
}));


describe('SearchBar', () => {
    const mockSetSearchQuery = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useBlogStore as unknown as jest.Mock).mockImplementation(() => ({
            setSearchQuery: mockSetSearchQuery,
        }));
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('renders the search input with correct attributes', () => {
        render(<SearchBar />);

        const input = screen.getByPlaceholderText('Search posts...');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveClass('w-full', 'p-4', 'rounded-lg', 'border', 'searchBar');
        expect(input.parentElement).toHaveClass('mb-8');
    });

    it('updates local query on user input', async () => {
        render(<SearchBar />);

        const input = screen.getByPlaceholderText('Search posts...');
        await userEvent.type(input, 'test query');

        expect(input).toHaveValue('test query');
    });

    it('calls setSearchQuery with debounced value', async () => {
        render(<SearchBar />);

        const input = screen.getByPlaceholderText('Search posts...');
        await userEvent.type(input, 'test query');

        expect(mockSetSearchQuery).toHaveBeenCalledTimes(11);
        expect(mockSetSearchQuery).toHaveBeenLastCalledWith('test query');
    });

    it('correctly handles debounced search', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(<SearchBar />);

        const input = screen.getByPlaceholderText('Search posts...');
        await user.type(input, 'test');

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(mockSetSearchQuery).toHaveBeenCalledWith('test');
    });
});