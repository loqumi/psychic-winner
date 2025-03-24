'use client';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import { useBlogStore } from '../stores/blogStore';

export default function SearchBar() {
    const [localQuery, setLocalQuery] = useState('');
    const [debouncedQuery] = useDebounce(localQuery, 300);
    const { setSearchQuery } = useBlogStore();

    useEffect(() => {
        setSearchQuery(debouncedQuery);
    }, [setSearchQuery,debouncedQuery]);

    return (
        <div className="mb-8">
            <input
                type="text"
                placeholder="Search posts..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full p-4 rounded-lg border searchBar"
            />
        </div>
    );
}