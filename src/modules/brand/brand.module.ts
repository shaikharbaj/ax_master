import { Module } from '@nestjs/common';

import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from './repository/brand.repository';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
    imports: [PrismaModule],
    controllers: [BrandController],
    providers: [BrandService, BrandRepository],
    exports: [BrandRepository],
})
export class BrandModule { }
