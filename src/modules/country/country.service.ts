/**
 * @fileoverview
 * country service file to handle all country logic functionality.
 *
 * @version
 * API version 1.0.
 *
 * @author
 * KATALYST TEAM
 *
 * @license
 * Licensing information, if applicable.
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CountryRepository } from './repository/country.repository';
import {
  CreateCountryBody,
  toggleCountryBody,
  UpdateCountryBody,
} from './types';

@Injectable()
export class CountryService {
  constructor(private countryRepository: CountryRepository) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    id: true,
    is_active: true,
    country_name: true,
    iso_code: true,
    mobile_code: true,
    currency_code: true,
    created_at: true,
    is_deleted: true,
  };

  /**
   * @description
   * Function to check if country exist by given condition
   */
  async isExistByCondition(condition: any) {
    const country = await this.countryRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return country;
  }

  /**
   * @description
   * Function to fetch all the country
   */
  async fetchAllCountry(page: number, searchText: string) {
    try {
      const country = await this.countryRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: false,
        },
      );
      return {
        status: true,
        message: 'Country fetched successfully.',
        data: country,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted the country
   */
  async fetchAllDeletedCountry(page: number, searchText: string) {
    try {
      const country = await this.countryRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: true,
        },
      );
      return {
        status: true,
        message: 'Deleted Country fetched successfully.',
        data: country,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the country by id
   */
  async findCountryById(id: number) {
    try {
      let condition = { id: id };
      const country = await this.countryRepository.findOne(
        this.select,
        condition,
      );

      if (!country) {
        throw new NotFoundException('Data not found');
      }
      return {
        status: true,
        message: 'country fetched successfully',
        data: country,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create country
   */
  async createCountry(auth: any, payload: CreateCountryBody) {
    try {
      //Checking country exists with same iso
      const isExistCountry: any = await this.isExistByCondition({
        iso_code: payload.iso_code,
      });
      if (isExistCountry && isExistCountry?.is_deleted === false) {
        throw new BadRequestException(
          'country with this iso code already exist.',
        );
      }
      //Preparing country upsert payload
      const countryCondition = {
        create: {
          country_name: payload.country_name,
          iso_code: payload.iso_code,
          mobile_code: +payload.mobile_code,
          currency_code: payload.currency_code,
          is_active: payload?.is_active,
          created_by: auth?.id,
        },
        update: {
          country_name: payload.country_name,
          iso_code: payload.iso_code,
          mobile_code: +payload.mobile_code,
          currency_code: payload.currency_code,
          is_active: payload.is_active === true ? true : false,
          updated_by: auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          iso_code: payload.iso_code,
        },
      };
      const createdCountry = await this.countryRepository.upsert(
        countryCondition.create,
        countryCondition.update,
        countryCondition.where,
      );
      if (createdCountry) {
        return {
          status: true,
          message: 'country created successfully',
        };
      }
      throw new BadRequestException('Error while creating country.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the country status i.e: active and inactive
   */
  async toggleCountryVisibility(
    id: number,
    auth: any,
    payload: toggleCountryBody,
  ) {
    try {
      //Checking country exist or not
      const country = await this.countryRepository.findOne(this.select, {
        id: +id,
      });
      if (!country) {
        throw new NotFoundException('No data found.');
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updateCountry = await this.countryRepository.update(
        { id: country.id },
        updatePayload,
      );
      if (updateCountry) {
        return {
          status: true,
          message: 'Country visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating country visibility.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the country details
   */
  async updateCountry(id: number, auth: any, payload: UpdateCountryBody) {
    try {
      //Chewcking country record exist or not
      let condition = { id: id };
      const country = await this.countryRepository.findOne(
        this.select,
        condition,
      );
      if (!country) {
        throw new NotFoundException('Data not found');
      }
      //Checking country with same iso already exist or not
      const anotherCountryWithSameName = await this.countryRepository.findOne(
        this.select,
        {
          id: { not: id },
          iso_code: payload.iso_code,
        },
      );
      if (anotherCountryWithSameName) {
        throw new BadRequestException(
          'country with this iso code already exist.',
        );
      }
      //Preparing update payload
      const updatePayload = {
        country_name: payload.country_name,
        iso_code: payload.iso_code,
        mobile_code: +payload.mobile_code,
        currency_code: payload.currency_code,
        is_active: payload?.is_active,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updateCountry = await this.countryRepository.update(
        { id: country.id },
        updatePayload,
      );
      if (updateCountry) {
        return {
          status: true,
          message: 'country updated successfully',
        };
      }
      throw new BadRequestException('Error while updating country.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the country
   */
  async deleteCountry(id: number, auth: any) {
    try {
      // Checking if record is deleted or not
      const country = await this.countryRepository.findOne(this.select, {
        id: id,
      });
      if (!country) {
        throw new NotFoundException('Data not found');
      }
      const updatePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedCountry = await this.countryRepository.update(
        { id: country.id },
        updatePayload,
      );
      if (deletedCountry) {
        return {
          status: true,
          message: 'Country deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting country.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore deleted the country details
   */
  async restoreCountry(id: number, auth: any) {
    try {
      //check country with this id present or not ...
      let condition = { id: id, is_deleted: true };
      const country = await this.countryRepository.findOne(
        this.select,
        condition,
      );
      if (!country) {
        throw new NotFoundException('Data not found');
      }
      //Preparing restore payload
      const restoreCondition = {
        payload: {
          is_active: true,
          updated_by: auth.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          id: country?.id,
          is_deleted: true,
        },
      };
      const updatedCountry = await this.countryRepository.update(
        restoreCondition.where,
        restoreCondition.payload,
      );
      if (updatedCountry) {
        return {
          status: true,
          message: 'country restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring country.');
    } catch (error) {
      throw error;
    }
  }
}
