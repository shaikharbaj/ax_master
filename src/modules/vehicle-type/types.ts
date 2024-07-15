export interface CreateVehicleBody {
    type: string;
    is_active?: boolean;
}

export interface UpdateVehicleBody {
    type: string;
    is_active?: boolean;
}

export interface ToggleVehicleTypeVisibilityBody {
    is_active: boolean;
}

