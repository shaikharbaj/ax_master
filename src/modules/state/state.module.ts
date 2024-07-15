import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { CountryRepository } from '../country/repository/country.repository';
import { StateRepository } from './repository/state.repository';
import { GlobalHelper } from 'src/common/helpers';

@Module({
  providers: [StateService, CountryRepository, StateRepository, GlobalHelper],
  controllers: [StateController],
})
export class StateModule { }
