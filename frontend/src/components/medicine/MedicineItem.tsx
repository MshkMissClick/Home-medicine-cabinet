import React, { useState } from 'react';
import { Medicine } from '../../types/medicine';
import { useMedicine } from '../../contexts/MedicineContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface MedicineItemProps {
    medicine: Medicine;
}

export const MedicineItem: React.FC<MedicineItemProps> = ({ medicine }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteMedicine } = useMedicine();
    const { user, addFavorite, removeFavorite } = useAuth();

    const isFavorite = user?.favoriteMedicines.includes(medicine.id) || false;

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            setIsDeleting(true);
            try {
                await deleteMedicine(medicine.id);
            } catch (error) {
                // Error handled in context
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleToggleFavorite = async () => {
        try {
            if (isFavorite) {
                await removeFavorite(medicine.id);
            } else {
                await addFavorite(medicine.id);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const isExpired = new Date(medicine.expiryDate) < new Date();
    const isExpiringSoon = () => {
        const expiryDate = new Date(medicine.expiryDate);
        const today = new Date();
        const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysDiff <= 7 && daysDiff >= 0;
    };

    return (
        <li className="px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {medicine.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {medicine.quantity} {medicine.unit} • {medicine.type.name}
                        </p>
                        <p className={`text-sm ${
                            isExpired ? 'text-red-600' :
                                isExpiringSoon() ? 'text-orange-600' :
                                    'text-gray-500'
                        }`}>
                            Expires: {formatDate(medicine.expiryDate)}
                            {isExpired && ' (Expired)'}
                            {isExpiringSoon() && !isExpired && ' (Expiring soon)'}
                        </p>
                        {medicine.applicationAreas.length > 0 && (
                            <p className="text-sm text-gray-500">
                                Areas: {medicine.applicationAreas.map(area => area.name).join(', ')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-full ${
                            isFavorite
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-400 hover:text-gray-500'
                        }`}
                    >
                        {isFavorite ? '★' : '☆'}
                    </button>

                    <Button
                        variant="danger"
                        size="sm"
                        loading={isDeleting}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </li>
    );
};