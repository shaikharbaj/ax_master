import { Module } from '@nestjs/common';
import { YardController } from './yard.controller';
import { YardService } from './yard.service';
import { yardRepository } from './repository';
import { GlobalHelper } from 'src/common/helpers';

@Module({
  controllers: [YardController],
  providers: [YardService,yardRepository,GlobalHelper]
})
export class YardModule {}
