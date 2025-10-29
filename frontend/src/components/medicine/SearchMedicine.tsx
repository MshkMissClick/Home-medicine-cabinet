import React, { useState } from 'react';
import { useMedicine } from '../../contexts/MedicineContext';
import { Input } from '../ui/Input';

export const SearchMedicine: React.FC = () => {
    const [query, setQuery] = useState('');
    const { searchMedicines } = useMedicine();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchMedicines(query);
    };

    const handleClear = () => {
        setQuery('');
        searchMedicines('');
    };

    return (
        <div className="mb-6">
            <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search medicines..."
                    className="flex-1"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Search
                </button>
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Clear
                    </button>
                )}
            </form>
        </div>
    );
};