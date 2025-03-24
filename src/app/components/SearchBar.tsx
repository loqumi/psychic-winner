'use client';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function SearchBar() {
    const [localQuery, setLocalQuery] = useState('');
    const [debouncedQuery] = useDebounce(localQuery, 300);

    console.log(debouncedQuery);

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