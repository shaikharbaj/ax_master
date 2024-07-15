import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CityRepository } from './repository';
import { GlobalHelper } from 'src/common/helpers';
import { StateRepository } from '../state/repository/state.repository';

@Module({
  controllers: [CityController],
  providers: [CityService,CityRepository,GlobalHelper,StateRepository]
})
export class CityModule {}
