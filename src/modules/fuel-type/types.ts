export interface CreateFuelBody {
    fuel_type: string;
    is_active?: boolean;
}

export interface UpdateFuelBody {
    fuel_type: string;
    is_active?: boolean;
}

export interface ToggleFuelTypeVisibilityBody {
    is_active: boolean;
}
