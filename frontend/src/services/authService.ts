import { api } from './api';
import { LoginCredentials, RegisterData, User } from '../types/auth';

export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async register(userData: RegisterData): Promise<{ user: User; token: string }> {
        const response = await api.post('/api/users/register', userData);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        const response = await api.put(`/api/users/${id}`, userData);
        return response.data;
    },

    async addFavoriteMedicine(userId: number, medicineId: number): Promise<void> {
        await api.post(`/api/users/${userId}/favorites/${medicineId}`);
    },

    async removeFavoriteMedicine(userId: number, medicineId: number): Promise<void> {
        await api.delete(`/api/users/${userId}/favorites/${medicineId}`);
    }
};