export interface User {
    id: number;
    username: string;
    email?: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    username: string;
}

export interface Medicine {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    expiryDate: string; // ISO date, e.g., "2025-12-31"
    type: { id: number; name: string };
    applicationAreas: { id: number; name: string }[];
}

export interface MedicineFormData {
    name: string;
    quantity: number;
    unit: string;
    expiryDate: string;
    typeId: number;
    areaIds: number[];
}

export interface MedicineType {
    id: number;
    name: string;
}

export interface ApplicationArea {
    id: number;
    name: string;
}

export interface Notification {
    id: number;
    text: string;
    date: string;
}