/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean, IsOptional, Matches } from 'class-validator';

export class UpdateFuelTypeDto {

    @IsNotEmpty({ message: "Please enter fuel type." })
    @Matches(/^[A-Za-z0-9\s]+$/, {
        message: 'Fuel type must contain only alphanumeric characters.',
      })
    readonly fuel_type: string;

    @IsOptional()
    @IsBoolean({ message: "Please enter valid value." })
    readonly is_active: boolean;
}
