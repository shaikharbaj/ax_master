import { Module } from '@nestjs/common';

import { VehicleTypeService } from './vehicle-type.service';
import { VehicleTypeController } from './vehicle-type.controller';
import { VehicleTypeRepository } from './repository/vehicle-type.repository';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
    imports: [PrismaModule],
    controllers: [VehicleTypeController],
    providers: [VehicleTypeService, VehicleTypeRepository],
    exports: [VehicleTypeRepository],
})
export class VehicleTypeModule { }
