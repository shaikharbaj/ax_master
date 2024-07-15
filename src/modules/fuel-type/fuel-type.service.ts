/**
 * @fileoverview
 * Fuel type service file to handle all fuel type logic functionality.
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
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FuelTypeRepository } from './repository';
import { CreateFuelBody, ToggleFuelTypeVisibilityBody, UpdateFuelBody } from './types';

@Injectable()
export class FuelTypeService {
  constructor(private fuelTypeRepository: FuelTypeRepository) { }

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    id: true,
    fuel_type: true,
    is_active: true,
    fuel_type_associations: true,
    created_at: true,
    is_deleted: true,
  };

  /**
 * @description
 * Function to check if fuel-type exist by given condition
 */
  async isExistByCondition(condition: any) {
    const feulType = await this.fuelTypeRepository.findOne(
      this.select,
      condition,
    );
    return feulType;

  }

  /**
   * @description
   * Function to fetch all the fuel-type without pagination
   */
  async fetchAllFuelType(page: number, searchText: string) {
    try {
      const FuelType = await this.fuelTypeRepository.findManyWithPaginate(page, this.select, {
        is_deleted: false,
      });
      return {
        status: true,
        message: 'Fuel types fetched successfully.',
        data: FuelType,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
* @description
* Function to fetch the all deleted fuel-type with paginate 
*/

  async fetchAllDeletedFuelType(page: number, searchText: string) {
    try {
      const fuelType =
        await this.fuelTypeRepository.findManyWithPaginate(page, this.select, {
          is_deleted: true,
        });

      return {
        status: true,
        message: 'Deleted fuel types fetched successfully.',
        data: fuelType,
      };
    } catch (error) {
      throw error
    }
  }

  /**
   * @description
   * Function to fetch the fuel-type by id
   */

  async findFuelTypeById(id: number) {
    try {
      let condition = { id: id };
      const FuelType = await this.fuelTypeRepository.findOne(
        this.select,
        condition
      );
      if (!FuelType) {
        throw new NotFoundException(
          'Data not found.',
        );
      }
      return {
        status: true,
        message: 'Fuel type fetched successfully.',
        data: FuelType,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create new fuel-type
   */

  async createFuelType(auth: any, payload: CreateFuelBody) {
    try {
      const isExistFuelType = await this.isExistByCondition({
        fuel_type: {
          equals: payload.fuel_type,
          mode: 'insensitive',
        },
      });
      if (isExistFuelType) {
        throw new BadRequestException(
          'Fuel type already exist.'
        );
      }

      //Preparing fuel-type upsert payload
      const fuelTypeCondition = {
        create: {
          fuel_type: payload.fuel_type,
          is_active: payload?.is_active,
          created_by: auth?.id,
        },
        update: {
          fuel_type: payload.fuel_type,
          is_active: payload.is_active === true ? true : false,
          updated_by: auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          fuel_type: payload.fuel_type
        },
      };

      const createdFuelType = await this.fuelTypeRepository.upsert(
        fuelTypeCondition.create,
        fuelTypeCondition.update,
        fuelTypeCondition.where,
      );

      if (createdFuelType) {
        return {
          status: true,
          message: 'Fuel type created successfully.',
        };
      }
      throw new BadRequestException('Error while creating fuel type.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the fuel-type status i.e: active and inactive
   */
  async toggleFuelTypeVisibility(id: number, auth: any, payload: ToggleFuelTypeVisibilityBody) {
    try {
      // Checking if record is deleted or not
      const fuelType = await this.isExistByCondition({
        id: id,
      });
      if (!fuelType) {
        throw new NotFoundException(
          'Data not found.',
        );
      }

      // Update is_active payload
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updateFuelType = await this.fuelTypeRepository.update(
        { id: fuelType.id },
        updatePayload,
      );
      if (updateFuelType) {
        return {
          status: true,
          message: 'Fuel type visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating fuel type visibility.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the fuel-type details
   */

  async updateFuelType(id: number, auth: any, payload: UpdateFuelBody) {
    try {
      // Checking if requested fuel-type already exist
      let condition = { id: id };
      const fuelType = await this.fuelTypeRepository.findOne(
        this.select,
        condition,
      );

      if (!fuelType) {
        throw new NotFoundException('Data not found');
      }

      //Checking fuel type with same type already exist or not
      const anotherFuelTypeWithSameType = await this.fuelTypeRepository.findOne(
        this.select,
        {
          id: { not: id },
          fuel_type: payload.fuel_type,
        },
      );

      if (anotherFuelTypeWithSameType) {
        throw new BadRequestException(
          'Fuel type already exist.'
        );
      }

      //Preparing update payload
      const updatePayload = {
        fuel_type: payload.fuel_type,
        is_active: payload?.is_active,
        updated_at: new Date(),
        updated_by: auth?.id,
      };

      const updateFuelType = await this.fuelTypeRepository.update(
        { id: fuelType.id },
        updatePayload,
      );
      if (updateFuelType) {
        return {
          status: true,
          message: 'Fuel type updated successfully',
        };
      }
      throw new BadRequestException('Error while updating fuel type.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the fuel-type
   */
  async deleteFuelType(id: number, auth: any) {
    try {
      // Checking if record is deleted or not
      const fuelType = await this.isExistByCondition({
        id: id,
      });
      if (!fuelType) {
        throw new NotFoundException(
          'Fuel type with this id does not exist.',
        );
      }

      const updatePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };

      const deletedFuelType = await this.fuelTypeRepository.update(
        { id: fuelType.id },
        updatePayload,
      );
      if (deletedFuelType) {
        return {
          status: true,
          message: 'Fuel type deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting fuel type.');
    } catch (error) {
      throw error;
    }
  }



  /**
* @description
* Function to restore deleted fuel-type
*/

  async restoreFuelType(id: number, auth: any) {
    try {
      let condition = { id: id, is_deleted: true };
      const fuelType = await this.fuelTypeRepository.findOne(
        this.select,
        condition,
      );
      if (!fuelType) {
        throw new NotFoundException('Data not found.');
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
          id: fuelType?.id,
          is_deleted: true
        }
      };

      const updatedFuelType = await this.fuelTypeRepository.update(restoreCondition.where, restoreCondition.payload);

      if (updatedFuelType) {
        return {
          status: true,
          message: 'Fuel type restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring fuel type.');

    } catch (error) {
      throw error
    }
  }


}
