import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<void>;
    addFavorite: (medicineId: number) => Promise<void>;
    removeFavorite: (medicineId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER'; payload: Partial<User> }
    | { type: 'ADD_FAVORITE'; payload: number }
    | { type: 'REMOVE_FAVORITE'; payload: number };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                error: null
            };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'LOGOUT':
            return {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null
            };
        case 'ADD_FAVORITE':
            return {
                ...state,
                user: state.user ? {
                    ...state.user,
                    favoriteMedicines: [...state.user.favoriteMedicines, action.payload]
                } : null
            };
        case 'REMOVE_FAVORITE':
            return {
                ...state,
                user: state.user ? {
                    ...state.user,
                    favoriteMedicines: state.user.favoriteMedicines.filter(id => id !== action.payload)
                } : null
            };
        default:
            return state;
    }
};

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    dispatch({ type: 'SET_LOADING', payload: true });
                    const user = JSON.parse(userData);
                    dispatch({ type: 'SET_USER', payload: user });
                } catch (error) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                } finally {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const { user, token } = await authService.login(credentials);

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.response?.data?.error || 'Login failed'
            });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const { user, token } = await authService.register(userData);

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.response?.data?.error || 'Registration failed'
            });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    const updateUser = async (userData: Partial<User>) => {
        if (!state.user) throw new Error('No user logged in');

        const updatedUser = await authService.updateUser(state.user.id, userData);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
    };

    const addFavorite = async (medicineId: number) => {
        if (!state.user) throw new Error('No user logged in');

        await authService.addFavoriteMedicine(state.user.id, medicineId);
        dispatch({ type: 'ADD_FAVORITE', payload: medicineId });
    };

    const removeFavorite = async (medicineId: number) => {
        if (!state.user) throw new Error('No user logged in');

        await authService.removeFavoriteMedicine(state.user.id, medicineId);
        dispatch({ type: 'REMOVE_FAVORITE', payload: medicineId });
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        updateUser,
        addFavorite,
        removeFavorite,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};