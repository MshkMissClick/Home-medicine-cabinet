export interface Medicine {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    expiryDate: string;
    type: MedicineType;
    applicationAreas: ApplicationArea[];
    userId: number;
}

export interface MedicineType {
    id: number;
    name: string;
}

export interface ApplicationArea {
    id: number;
    name: string;
}

export interface CreateMedicineRequest {
    name: string;
    quantity: number;
    unit: string;
    expiryDate: string;
    typeId: number;
    areaIds: number[];
}