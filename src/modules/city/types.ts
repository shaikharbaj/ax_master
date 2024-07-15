export interface CreateCityBody {
    state_id: number;
    name: string;
    is_active?: boolean | string; // Marked as optional since @IsOptional decorator is used
  }
  
  export interface ToggleCityVisibilityBody {
    is_active: boolean | string;
  }
  
  export interface UpdateCityBody {
    state_id: number;
    name: string;
    is_active?: boolean | string;
  }