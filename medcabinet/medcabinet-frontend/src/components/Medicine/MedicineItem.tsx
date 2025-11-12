import React, { useState } from 'react';
import { Card, CardContent, Button, Typography, IconButton, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Medicine } from '../../types';

interface MedicineListProps {
    medicines: Medicine[];
    onEdit: (medicine: Medicine) => void;
    onDelete: (id: number) => void;
}

const MedicineList = ({ medicines, onEdit, onDelete }: MedicineListProps) => {
    const [openDialog, setOpenDialog] = useState<number | null>(null); // ID лекарства для удаления

    const handleDeleteClick = (id: number) => {
        setOpenDialog(id);
    };

    const handleConfirmDelete = () => {
        if (openDialog !== null) {
            onDelete(openDialog);
            setOpenDialog(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(null);
    };

    return (
        <Box>
            {medicines.map((medicine) => (
                <Card key={medicine.id} sx={{ mb: 2, borderRadius: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6">{medicine.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Количество: {medicine.quantity} {medicine.unit}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Срок годности: {new Date(medicine.expiryDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Тип: {medicine.type.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Области применения: {medicine.applicationAreas.map((area) => area.name).join(', ')}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton onClick={() => onEdit(medicine)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(medicine.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
            {medicines.length === 0 && (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Нет лекарств для отображения
                </Typography>
            )}
            <Dialog
                open={openDialog !== null}
                onClose={handleCancelDelete}
                aria-labelledby="confirm-delete-dialog-title"
                aria-describedby="confirm-delete-dialog-description"
            >
                <DialogTitle id="confirm-delete-dialog-title">Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-delete-dialog-description">
                        Вы уверены, что хотите удалить лекарство "{medicines.find((m) => m.id === openDialog)?.name || ''}"? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MedicineList;