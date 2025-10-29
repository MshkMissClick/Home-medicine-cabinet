import React, { useState, useEffect } from 'react';
import { useMedicine } from '../../contexts/MedicineContext';
import { medicineService } from '../../services/medicineService';
import { MedicineType, ApplicationArea, CreateMedicineRequest } from '../../types/medicine';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface AddMedicineFormProps {
    onClose: () => void;
}

export const AddMedicineForm: React.FC<AddMedicineFormProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [typeId, setTypeId] = useState('');
    const [areaIds, setAreaIds] = useState<number[]>([]);
    const [medicineTypes, setMedicineTypes] = useState<MedicineType[]>([]);
    const [applicationAreas, setApplicationAreas] = useState<ApplicationArea[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { createMedicine } = useMedicine();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [types, areas] = await Promise.all([
                    medicineService.getMedicineTypes(),
                    medicineService.getApplicationAreas()
                ]);
                setMedicineTypes(types);
                setApplicationAreas(areas);
            } catch (error) {
                console.error('Failed to load form data:', error);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const medicineData: CreateMedicineRequest = {
                name,
                quantity: parseInt(quantity),
                unit,
                expiryDate,
                typeId: parseInt(typeId),
                areaIds
            };

            await createMedicine(medicineData);
            onClose();
        } catch (error) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleAreaToggle = (areaId: number) => {
        setAreaIds(prev =>
            prev.includes(areaId)
                ? prev.filter(id => id !== areaId)
                : [...prev, areaId]
        );
    };

    return (
        <Modal onClose={onClose} title="Add New Medicine">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Medicine Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Paracetamol"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g., 250"
                        required
                    />

                    <Input
                        label="Unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="e.g., mg, ml, pcs"
                        required
                    />
                </div>

                <Input
                    label="Expiry Date"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medicine Type
                    </label>
                    <select
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Select a type</option>
                        {medicineTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Areas
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                        {applicationAreas.map(area => (
                            <label key={area.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={areaIds.includes(area.id)}
                                    onChange={() => handleAreaToggle(area.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{area.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isLoading}
                    >
                        Add Medicine
                    </Button>
                </div>
            </form>
        </Modal>
    );
};