import { api } from './api';
import { Medicine, CreateMedicineRequest, MedicineType, ApplicationArea } from '../types/medicine';

export const medicineService = {
    async getAllMedicines(): Promise<Medicine[]> {
        const response = await api.get('/api/medicines');
        return response.data;
    },

    async getMedicineById(id: number): Promise<Medicine> {
        const response = await api.get(`/api/medicines/${id}`);
        return response.data;
    },

    async createMedicine(medicineData: CreateMedicineRequest): Promise<Medicine> {
        const response = await api.post('/api/medicines', medicineData);
        return response.data;
    },

    async updateMedicine(id: number, medicineData: Partial<Medicine>): Promise<Medicine> {
        const response = await api.put(`/api/medicines/${id}`, medicineData);
        return response.data;
    },

    async deleteMedicine(id: number): Promise<void> {
        await api.delete(`/api/medicines/${id}`);
    },

    async searchMedicines(name: string): Promise<Medicine[]> {
        const response = await api.get(`/api/medicines/search?name=${name}`);
        return response.data;
    },

    async getExpiredMedicines(): Promise<Medicine[]> {
        const response = await api.get('/api/medicines/expired');
        return response.data;
    },

    async getExpiringSoonMedicines(days: number = 7): Promise<Medicine[]> {
        const response = await api.get(`/api/medicines/expiring-soon?days=${days}`);
        return response.data;
    },

    async getMedicineTypes(): Promise<MedicineType[]> {
        const response = await api.get('/api/medicine-types');
        return response.data;
    },

    async getApplicationAreas(): Promise<ApplicationArea[]> {
        const response = await api.get('/api/application-areas');
        return response.data;
    }
};