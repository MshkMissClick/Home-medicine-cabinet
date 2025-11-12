import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import medicineReducer from './medicineSlice';
import notificationReducer from './notificationSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        medicines: medicineReducer,
        notifications: notificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();