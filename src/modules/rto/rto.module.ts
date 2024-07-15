import { Module } from '@nestjs/common';
import { RtoController } from './rto.controller';
import { RtoService } from './rto.service';
import { StateRepository } from '../state/repository';
import { RtoRepository } from './repository';

@Module({
  controllers: [RtoController],
  providers: [RtoService,StateRepository,RtoRepository],
})
export class RtoModule {}
