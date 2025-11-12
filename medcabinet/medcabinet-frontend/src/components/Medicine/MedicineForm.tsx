import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import api from '../../services/api';
import { Medicine, MedicineFormData, MedicineType, ApplicationArea } from '../../types';

const schema = yup.object({
    name: yup.string().required('Название обязательно').default(''),
    quantity: yup.number().positive('Количество должно быть положительным').required('Количество обязательно').default(0),
    unit: yup.string().required('Единица измерения обязательна').default(''),
    expiryDate: yup.string().required('Срок годности обязателен').default(''),
    typeId: yup.number().required('Тип обязателен').default(0),
    areaIds: yup
        .array()
        .of(yup.number().required('Элемент области не может быть пустым'))
        .min(1, 'Выберите хотя бы одну область')
        .required('Области применения обязательны')
        .default([]), // Явно указываем дефолтное значение
});

interface MedicineFormProps {
    medicine?: Medicine;
    onSubmit: (data: MedicineFormData) => void;
    onCancel: () => void;
}

const MedicineForm = ({ medicine, onSubmit, onCancel }: MedicineFormProps) => {
    const [types, setTypes] = useState<MedicineType[]>([]);
    const [areas, setAreas] = useState<ApplicationArea[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MedicineFormData>({
        resolver: yupResolver<MedicineFormData, any, MedicineFormData>(schema),
        defaultValues: medicine
            ? {
                name: medicine.name,
                quantity: medicine.quantity,
                unit: medicine.unit,
                expiryDate: medicine.expiryDate.split('T')[0],
                typeId: medicine.type.id,
                areaIds: medicine.applicationAreas.map((area) => area.id),
            }
            : {
                name: '',
                quantity: 0,
                unit: '',
                expiryDate: '',
                typeId: 0,
                areaIds: [],
            },
    });

    useEffect(() => {
        const fetchTypesAndAreas = async () => {
            try {
                const [typesRes, areasRes] = await Promise.all([
                    api.get<MedicineType[]>('/medicine-types'),
                    api.get<ApplicationArea[]>('/application-areas'),
                ]);
                setTypes(typesRes.data);
                setAreas(areasRes.data);
            } catch (error) {
                console.error('Error fetching types and areas:', error);
            }
        };
        fetchTypesAndAreas();
    }, []);

    const onSubmitHandler: SubmitHandler<MedicineFormData> = (data) => {
        onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                Лекарство
            </Typography>
            <TextField
                label="Название"
                fullWidth
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
            />
            <TextField
                label="Количество"
                type="number"
                fullWidth
                margin="normal"
                {...register('quantity')}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
            />
            <TextField
                label="Единица измерения"
                fullWidth
                margin="normal"
                {...register('unit')}
                error={!!errors.unit}
                helperText={errors.unit?.message}
            />
            <TextField
                label="Срок годности"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register('expiryDate')}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate?.message}
            />
            <FormControl fullWidth margin="normal" error={!!errors.typeId}>
                <InputLabel>Тип</InputLabel>
                <Select {...register('typeId')} defaultValue={medicine?.type.id || ''}>
                    <MenuItem value="">
                        <em>Выберите тип</em>
                    </MenuItem>
                    {types.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.typeId && <Box sx={{ color: 'red', mt: 1 }}>{errors.typeId.message}</Box>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={!!errors.areaIds}>
                <InputLabel>Области применения</InputLabel>
                <Select multiple {...register('areaIds')} defaultValue={medicine?.applicationAreas.map((a) => a.id) || []}>
                    {areas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                            {area.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.areaIds && <Box sx={{ color: 'red', mt: 1 }}>{errors.areaIds.message}</Box>}
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained">
                    Сохранить
                </Button>
                <Button variant="outlined" onClick={onCancel}>
                    Отмена
                </Button>
            </Box>
        </Box>
    );
};

export default MedicineForm;