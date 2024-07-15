/* eslint-disable prettier/prettier */
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class UpdateVehicleTypeDto {
    @IsNotEmpty({ message: 'Please enter vehicle type.' })
    @Matches(/^[A-Za-z0-9\s]+$/, {
        message: 'Vehicle type must contain only alphanumeric characters.',
    })
    readonly type: string;

    @IsOptional()
    @IsBoolean({ message: 'Please enter valid is_active value.' })
    readonly is_active: boolean;
}
