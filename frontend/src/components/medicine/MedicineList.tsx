import React, { useEffect, useState } from 'react';
import { useMedicine } from '../../contexts/MedicineContext';
import { useAuth } from '../../contexts/AuthContext';
import { MedicineItem } from './MedicineItem';
import { SearchMedicine } from './SearchMedicine';
import { AddMedicineForm } from './AddMedicineForm';
import { Button } from '../ui/Button';

export const MedicineList: React.FC = () => {
    const { medicines, isLoading, error, loadMedicines } = useMedicine();
    const { isAuthenticated } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            loadMedicines();
        }
    }, [isAuthenticated, loadMedicines]);

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to MedCabinet
                </h2>
                <p className="text-gray-600 mb-8">
                    Please log in to manage your medicines
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">MedCabinet</h1>
                <Button onClick={() => setShowAddForm(true)}>
                    Add Medicine
                </Button>
            </div>

            <SearchMedicine />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {medicines.map((medicine) => (
                        <MedicineItem key={medicine.id} medicine={medicine} />
                    ))}
                </ul>

                {medicines.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No medicines found. Add your first medicine!</p>
                    </div>
                )}
            </div>

            {showAddForm && (
                <AddMedicineForm onClose={() => setShowAddForm(false)} />
            )}
        </div>
    );
};