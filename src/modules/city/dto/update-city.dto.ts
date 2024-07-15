/* eslint-disable prettier/prettier */
import { IsNumberString, IsNotEmpty, IsIn, IsOptional, Matches } from 'class-validator';

export class UpdateCityDto {
  @IsNotEmpty({ message: 'Please enter state id.' })
  @IsNumberString()
  readonly state_id: number;

  @IsNotEmpty({ message: 'Please enter city name.' })
  @Matches(/^[A-Za-z\s&-]+$/, { message: 'Name must contain only alphabetic characters.' })
  readonly name: string;

  @IsOptional()
  // @IsBoolean({ message: 'Please enter valid value.' })
  @IsIn(['true', 'false'], { message: 'Is active should be true or false.' })
  readonly is_active: boolean;
}