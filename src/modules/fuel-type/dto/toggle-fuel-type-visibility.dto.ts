/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class ToggleFuelTypeVisibilityDto {
    @IsNotEmpty({ message: "Please enter visibility type." })
    @IsBoolean({ message: "Please enter valid value." })
    readonly is_active: boolean;
}
