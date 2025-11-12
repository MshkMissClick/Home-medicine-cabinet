import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { Notification } from '../types';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
});

export const deleteNotification = createAsyncThunk('notifications/deleteNotification', async (id: number) => {
    await api.delete(`/notifications/${id}`);
    return id;
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [] as Notification[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch notifications';
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.items = state.items.filter((n) => n.id !== action.payload);
            });
    },
});

export default notificationSlice.reducer;