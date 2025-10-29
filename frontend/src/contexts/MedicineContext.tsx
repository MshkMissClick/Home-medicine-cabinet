import React, { createContext, useContext, useReducer } from 'react';
import { Medicine, CreateMedicineRequest } from '../types/medicine';
import { medicineService } from '../services/medicineService';

interface MedicineState {
    medicines: Medicine[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    selectedMedicine: Medicine | null;
}

interface MedicineContextType extends MedicineState {
    loadMedicines: () => Promise<void>;
    createMedicine: (medicineData: CreateMedicineRequest) => Promise<void>;
    updateMedicine: (id: number, medicineData: Partial<Medicine>) => Promise<void>;
    deleteMedicine: (id: number) => Promise<void>;
    searchMedicines: (query: string) => Promise<void>;
    setSelectedMedicine: (medicine: Medicine | null) => void;
    clearError: () => void;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

type MedicineAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_MEDICINES'; payload: Medicine[] }
    | { type: 'ADD_MEDICINE'; payload: Medicine }
    | { type: 'UPDATE_MEDICINE'; payload: Medicine }
    | { type: 'DELETE_MEDICINE'; payload: number }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_SELECTED_MEDICINE'; payload: Medicine | null };

const medicineReducer = (state: MedicineState, action: MedicineAction): MedicineState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_MEDICINES':
            return { ...state, medicines: action.payload, isLoading: false };
        case 'ADD_MEDICINE':
            return { ...state, medicines: [...state.medicines, action.payload] };
        case 'UPDATE_MEDICINE':
            return {
                ...state,
                medicines: state.medicines.map(med =>
                    med.id === action.payload.id ? action.payload : med
                )
            };
        case 'DELETE_MEDICINE':
            return {
                ...state,
                medicines: state.medicines.filter(med => med.id !== action.payload)
            };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_SELECTED_MEDICINE':
            return { ...state, selectedMedicine: action.payload };
        default:
            return state;
    }
};

const initialState: MedicineState = {
    medicines: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedMedicine: null,
};

export const MedicineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(medicineReducer, initialState);

    const loadMedicines = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const medicines = await medicineService.getAllMedicines();
            dispatch({ type: 'SET_MEDICINES', payload: medicines });
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.response?.data?.error || 'Failed to load medicines'
            });
        }
    };

    const createMedicine = async (medicineData: CreateMedicineRequest) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const newMedicine = await medicineService.createMedicine(medicineData);
            dispatch({ type: 'ADD_MEDICINE', payload: newMedicine });
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.response?.data?.error || 'Failed to create medicine'
            });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateMedicine = async (id: number, medicineData: Partial<Medicine>) => {
        try {
            const updatedMedicine = await medicineService.updateMedicine(id, medicineData);
            dispatch({ type: 'UPDATE_MEDICINE', payload: updatedMedicine });
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.response?.data?.error || 'Failed to update medicine'
            });
            throw error;
        }
    };

    const deleteMedicine = async (id: number) => {
        try {
            await medicineService.deleteMedicine(id);
            dispatch({ type: 'DELETE_MEDICINE', payload: id });
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.response?.data?.error || 'Failed to delete medicine'
            });
            throw error;
        }
    };

    const searchMedicines = async (query: string) => {
        try {
            dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
            if (query.trim()) {
                const medicines = await medicineService.searchMedicines(query);
                dispatch({ type: 'SET_MEDICINES', payload: medicines });
            } else {
                await loadMedicines();
            }
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.response?.data?.error || 'Search failed'
            });
        }
    };

    const setSelectedMedicine = (medicine: Medicine | null) => {
        dispatch({ type: 'SET_SELECTED_MEDICINE', payload: medicine });
    };

    const clearError = () => {
        dispatch({ type: 'SET_ERROR', payload: null });
    };

    const value: MedicineContextType = {
        ...state,
        loadMedicines,
        createMedicine,
        updateMedicine,
        deleteMedicine,
        searchMedicines,
        setSelectedMedicine,
        clearError,
    };

    return (
        <MedicineContext.Provider value={value}>
            {children}
        </MedicineContext.Provider>
    );
};

export const useMedicine = () => {
    const context = useContext(MedicineContext);
    if (context === undefined) {
        throw new Error('useMedicine must be used within a MedicineProvider');
    }
    return context;
};