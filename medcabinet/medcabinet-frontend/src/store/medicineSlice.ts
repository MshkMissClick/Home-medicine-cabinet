import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { Medicine, MedicineFormData } from '../types';

export const fetchMedicines = createAsyncThunk('medicines/fetchMedicines', async () => {
    const response = await api.get<Medicine[]>('/medicines');
    return response.data;
});

export const createMedicine = createAsyncThunk('medicines/createMedicine', async (data: MedicineFormData) => {
    const response = await api.post<Medicine>('/medicines', data);
    return response.data;
});

export const updateMedicine = createAsyncThunk('medicines/updateMedicine', async ({ id, data }: { id: number; data: MedicineFormData }) => {
    const response = await api.put<Medicine>(`/medicines/${id}`, data);
    return response.data;
});

export const deleteMedicine = createAsyncThunk('medicines/deleteMedicine', async (id: number) => {
    await api.delete(`/medicines/${id}`);
    return id;
});

const medicineSlice = createSlice({
    name: 'medicines',
    initialState: {
        items: [] as Medicine[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicines.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMedicines.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchMedicines.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch medicines';
            })
            .addCase(createMedicine.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateMedicine.fulfilled, (state, action) => {
                const index = state.items.findIndex((m) => m.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteMedicine.fulfilled, (state, action) => {
                state.items = state.items.filter((m) => m.id !== action.payload);
            });
    },
});

export default medicineSlice.reducer;