import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CountryRepository } from './repository/country.repository';

@Module({
  controllers: [CountryController],
  providers: [CountryService, CountryRepository],
})
export class CountryModule {}
