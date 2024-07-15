import { Module } from '@nestjs/common';
import {
  PrismaModule,
  VehicleTypeModule,
  CountryModule,
  StateModule,
  FuelTypeModule,
  CityModule
} from './modules';
import { ConfigModule } from '@nestjs/config';
import { YardModule } from './modules/yard/yard.module';
import { RtoModule } from './modules/rto/rto.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CountryModule,
    VehicleTypeModule,
    StateModule,
    FuelTypeModule,
    CityModule,
    YardModule,
    RtoModule
  ],
})
export class AppModule { }
