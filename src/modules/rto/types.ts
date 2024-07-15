export interface CreateRTOBody {
    reg_no: string;
    address: string;
    rto_state_id: number;
    rto_state_name: string;
    is_active?: boolean;
  }
  
  export interface UpdateRTOBody {
    reg_no: string;
    address: string;
    rto_state_id: number;
    rto_state_name: string;
    is_active?: boolean;
  }
  
  export interface toggleRTOBody {
    is_active: boolean | string;
  }
  