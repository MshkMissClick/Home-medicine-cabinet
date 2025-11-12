import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { fetchMedicines, createMedicine, updateMedicine, deleteMedicine } from '../store/medicineSlice';
import MedicineList from '../components/Medicine/MedicineList';
import MedicineForm from '../components/Medicine/MedicineForm';
import MainLayout from '../components/Layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Medicine } from '../types';
import { Button, Dialog, Box, Typography, TextField } from '@mui/material';

const HomePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state: RootState) => state.auth);
    const medicines = useSelector((state: RootState) => state.medicines.items);
    const [openForm, setOpenForm] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<Medicine | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поиска

    useEffect(() => {
        if (!token) {
            navigate('/auth');
        } else {
            dispatch(fetchMedicines());
        }
    }, [token, dispatch, navigate]);

    const handleSubmit = (data: any) => {
        if (editingMedicine) {
            dispatch(updateMedicine({ id: editingMedicine.id, data }));
        } else {
            dispatch(createMedicine(data));
        }
        setOpenForm(false);
        setEditingMedicine(undefined);
    };

    const handleEdit = (medicine: Medicine) => {
        setEditingMedicine(medicine);
        setOpenForm(true);
    };

    // Фильтрация лекарств по поиску (по названию)
    const filteredMedicines = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Список лекарств
                </Typography>
                <TextField
                    label="Поиск по названию"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mb: 3 }}>
                    Добавить лекарство
                </Button>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <MedicineList
                        medicines={filteredMedicines}
                        onEdit={handleEdit}
                        onDelete={(id) => dispatch(deleteMedicine(id))}
                    />
                </Box>
                <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                    <MedicineForm
                        medicine={editingMedicine}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setOpenForm(false);
                            setEditingMedicine(undefined);
                        }}
                    />
                </Dialog>
            </Box>
        </MainLayout>
    );
};

export default HomePage;