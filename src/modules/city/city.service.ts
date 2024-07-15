import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityRepository } from './repository';
import { GlobalHelper } from 'src/common/helpers';
import {
  CreateCityBody,
  ToggleCityVisibilityBody,
  UpdateCityBody,
} from './types';
import { StateRepository } from '../state/repository/state.repository';
@Injectable()
export class CityService {
  constructor(
    private cityRepository: CityRepository,
    private stateRepository: StateRepository,
    private globalHelper: GlobalHelper,
  ) {}
  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    id: true,
    state_id: true,
    city_name: true,
    is_deleted: true,
  };

  /**
   * @description
   * Function to check if city exist by given condition
   */
  async isExistByCondition(condition: any) {
    const city = await this.cityRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return city;
  }

  /**
   * @description
   * Function to fetch all the city
   */
  async fetchAllCity(page: number, searchText: string) {
    try {
      const city = await this.cityRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: false,
        },
      );
      return {
        status: true,
        message: 'city fetched successfully.',
        data: city,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted city
   */
  async fetchAllDeletedCity(page: number, searchText: string) {
    try {
      const deletedCities = await this.cityRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: true,
        },
      );
      return {
        status: true,
        message: 'All Deleted Cities fetched successfully.',
        data: deletedCities,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the city by id
   */
  async findCityById(id: number) {
    try {
      let condition = { id: id };
      const city = await this.cityRepository.findOne(this.select, condition);

      if (!city) {
        throw new NotFoundException('Data not found');
      }
      return {
        status: true,
        message: 'city fetched successfully',
        data: city,
      };
    } catch (error) {
      throw error;
    }
  }

  /* @description
   * Function to create new city
   */
  async createCity(auth: any, payload: CreateCityBody) {
    try {
      //  check state exist or not......
      const isExistByCondition = await this.stateRepository.findOne(
        { id: true, state_name: true },
        { id: +payload.state_id },
      );

      if (!isExistByCondition) {
        throw new NotFoundException('state does not exist.');
      }
      let cityName = this.globalHelper.convertToTitleCase(payload.name);
      // Checking if requested city already exist
      const isExistCity = await this.isExistByCondition({
        AND: [{ state_id: +payload.state_id }, { city_name: cityName }],
      });

      if (isExistCity && !isExistCity?.is_deleted) {
        throw new BadRequestException('City already exist.');
      }
      const cityCondition = {
        create: {
          state_id: +payload.state_id,
          city_name: cityName,
          is_active: payload.is_active === 'true' ? true : false,
          created_by: auth?.id,
        },
        update: {
          state_id: +payload.state_id,
          city_name: payload.name,
          is_active: payload.is_active === 'true' ? true : false,
          updated_by: +auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          state_id_city_name: {
            state_id: +payload.state_id,
            city_name: cityName,
          },
        },
      };
      const createdCity = await this.cityRepository.upsert(
        cityCondition.create,
        cityCondition.update,
        cityCondition.where,
      );
      if (createdCity) {
        return {
          status: true,
          message: 'City created successfully.',
        };
      }
      throw new ForbiddenException('Error while creating city.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the city details
   */
  async updateCity(id: number, auth: any, payload: UpdateCityBody) {
    try {
      //Checking whether state esits or not.
      const cityExist = await this.cityRepository.findOne(
        { id: true, city_name: true, state_id: true },
        { id: +id },
      );
      if (!cityExist) {
        throw new NotFoundException('city information not found.');
      }

      const isStateExist = await this.stateRepository.findOne(
        { id: true, state_name: true },
        {
          id: +payload.state_id,
        },
      );
      if (!isStateExist) {
        throw new NotFoundException('state does not exist.');
      }

      //checking another city exist with same name..
      const anotherCityExistWithSameName = await this.isExistByCondition({
        id: { not: id },
        AND: [
          { state_id: isStateExist.id },
          { city_name: payload.name },
          { is_deleted: false },
        ],
      });

      if (anotherCityExistWithSameName) {
        throw new BadRequestException('city already exist.');
      }

      //checking another state exist with same name in deleted records
      const anotherCityExistWithSameNameWithDeleted =
        await this.isExistByCondition({
          is_deleted: true,
          AND: [
            { state_id: isStateExist.id },
            { city_name: this.globalHelper.convertToTitleCase(payload.name) },
          ],
        });

      if (anotherCityExistWithSameNameWithDeleted) {
        throw new BadRequestException(
          'city already exist, In deleted records.',
        );
      }
      const cityPayload = {
        state_id: +payload.state_id,
        city_name: this.globalHelper.convertToTitleCase(payload.name),
        is_active: payload.is_active === 'true' ? true : false,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updatedCity = await this.cityRepository.update(
        { id: id },
        cityPayload,
      );

      if (updatedCity) {
        return {
          status: true,
          message: 'city updated successfully',
        };
      }
      throw new BadRequestException('Error while updating state.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore the deleted city details
   */
  async restoreDeletedCity(id: number, auth: any) {
    try {
      // //Checking city details exist or not
      let condition = { id: +id, is_deleted: true };
      const isCityExist = await this.cityRepository.findOne(
        this.select,
        condition,
      );
      if (!isCityExist) {
        throw new NotFoundException('City information not found.');
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
          id: isCityExist?.id,
          is_deleted: true,
        },
      };

      const restoredCity = await this.cityRepository.update(
        restoreCondition.where,
        restoreCondition.payload,
      );

      if (restoredCity) {
        return {
          status: true,
          message: 'City restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring city.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the city
   */
  async deleteCity(id: number, auth: any) {
    try {
      // Checking if record is deleted or not
      const isExist = await this.cityRepository.findOne(this.select, {
        id: id,
      });
      if (!isExist) {
        throw new NotFoundException('No data found.');
      }
      const cityPayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedcity = await this.cityRepository.update({ id }, cityPayload);
      if (deletedcity) {
        return {
          status: true,
          message: 'City deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting city.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the city status i.e: active and inactive
   */
  async toggleCityVisibility(
    id: number,
    auth: any,
    payload: ToggleCityVisibilityBody,
  ) {
    try {
      //Checking city exist or not
      const city = await this.cityRepository.findOne(this.select, {
        id: +id,
      });
      if (!city) {
        throw new NotFoundException('No data found.');
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updatecity = await this.cityRepository.update(
        { id: city.id },
        updatePayload,
      );
      if (updatecity) {
        return {
          status: true,
          message: 'city visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating country visibility.');
    } catch (error) {
      throw error;
    }
  }
}
