/**
 * @fileoverview
 * vehicle type service file to handle all vehicle type logic functionality.
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
import { VehicleTypeRepository } from './repository';
import { CreateVehicleBody, ToggleVehicleTypeVisibilityBody, UpdateVehicleBody } from './types';

@Injectable()
export class VehicleTypeService {
  constructor(private vehicleTypeRepository: VehicleTypeRepository) { }

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */

  public select: any = {
    id: true,
    type: true,
    is_active: true,
    image: true,
    vehicle_type_associations: true,
    created_at: true,
    is_deleted: true
  };

  /**
 * @description
 * Function to check if vehicle-type exist by given condition
 */
  async isExistByCondition(condition: any) {
    const vehicleType = await this.vehicleTypeRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return vehicleType
  }

  /**
   * @description
   * Function to fetch all the vehicle-type
   */
  async fetchAllVehicleType(page: number, searchText: string) {
    try {
      const vehicleType = await this.vehicleTypeRepository.findManyWithPaginate(page, this.select, {
        is_deleted: false,
      });
      return {
        status: true,
        message: 'Vehicle type fetched successfully.',
        data: vehicleType,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
 * @description
 * Function to fetch all deleted vehicle-type 
 */

  async fetchAllDeletedVehicleType(page: number, searchText: string) {
    try {
      const vehicleType = await this.vehicleTypeRepository.findManyWithPaginate(page, this.select, {
        is_deleted: true,
      });

      return {
        status: true,
        message: 'Deleted Vehicle type fetched successfully.',
        data: vehicleType,
      };
    } catch (error) {
      throw error
    }
  }

  /**
   * @description
   * Function to fetch the vehicle-type by id
   */
  async findVehicleTypeById(id: number) {
    try {
      let condition = { id: id };
      const vehicleType = await this.vehicleTypeRepository.findOne(
        this.select,
        condition,
      );
      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found.');
      }
      return {
        status: true,
        message: 'Vehicle type fetched successfully.',
        data: vehicleType,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create new vehicle-type
   */
  async createVehicleType(auth: any, payload: CreateVehicleBody) {
    {
      try {
        // Checking if requested vehicle-type already exist
        const isExistVehicleType = await this.isExistByCondition({
          type: {
            equals: payload.type.toUpperCase(),
            mode: 'insensitive',
          },
        });
        if (isExistVehicleType && isExistVehicleType?.is_deleted === false) {
          throw new BadRequestException('Vehicle type already exist.');
        }
        console.log({ isExistVehicleType })
        //Preparing Vehicle Type upsert payload
        const vehicleTypeCondition = {
          create: {
            type: payload.type.toUpperCase(),
            is_active: payload?.is_active,
            created_by: auth?.id,
          },
          update: {
            type: payload.type.toUpperCase(),
            created_by: auth?.id,
            is_active: payload.is_active === true ? true : false,
            updated_by: auth?.id,
            is_deleted: false,
            deleted_at: null,
            deleted_by: null,
          },
          where: {
            type: payload.type,
          },
        };

        const createdVehicleType: any = await this.vehicleTypeRepository.upsert(
          vehicleTypeCondition.create,
          vehicleTypeCondition.update,
          vehicleTypeCondition.where
        );

        if (createdVehicleType) {
          return {
            status: true,
            message: 'Vehicle type created successfully',
          };
        }
        throw new BadRequestException('Error while creating vehicle type.');
      } catch (error) {
        throw error;
      }
    }
  }

  /**
 * @description
 * Function to toggle the vehicle-type status i.e: active and inactive
 */
  async toggleVehicleTypeVisibility(
    id: number,
    payload: ToggleVehicleTypeVisibilityBody,
    auth: any
  ) {
    try {
      // Checking vehicle type exist or not
      const vehicleType = await this.isExistByCondition({ id: id });

      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found.');
      }

      // Update is_active payload
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };

      const updateVehicleType = await this.vehicleTypeRepository.update(
        { id: vehicleType.id },
        updatePayload,
      );

      if (updateVehicleType) {
        return {
          status: true,
          message: 'Vehicle type visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating vehicle type visibility.');
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  /**
   * @description
   * Function to update the vehicle-type details
   */

  async updateVehicleType(id: number, payload: UpdateVehicleBody, auth: any) {
    try {
      // Checking if requested vehicle type already exist
      let condition = { id: id };
      const vehicleType = await this.vehicleTypeRepository.findOne(
        this.select,
        condition,
      );

      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found');
      }
      //Checking vehicle type with same type already exist or not
      const anotherVehicleTypeWithSameType = await this.vehicleTypeRepository.findOne(
        this.select,
        {
          id: { not: id },
          type: payload.type,
        },
      );

      if (anotherVehicleTypeWithSameType) {
        throw new BadRequestException('Vehicle type already exist.');
      }

      //Preparing update payload
      const updatePayload = {
        type: payload.type.toUpperCase(),
        is_active: payload?.is_active,
        updated_at: new Date(),
        updated_by: auth?.id,

      };

      const updateVehicleType: any = await this.vehicleTypeRepository.update(
        { id: vehicleType.id },
        updatePayload,
      );
      if (updateVehicleType) {
        return {
          status: true,
          message: 'Vehicle Type updated successfully',
        };
      }
      throw new BadRequestException('Error while updating vehicle type.');

    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the vehicle-type
   */

  async deleteVehicleType(id: number, auth: any) {
    try {
      // Checking if record is deleted or not
      const vehicleType = await this.isExistByCondition({
        id: id,
      });
      if (!vehicleType) {
        throw new NotFoundException('Data not found');
      }

      const updatePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedVehicleType = await this.vehicleTypeRepository.update(
        { id: id },
        updatePayload,
      );

      if (deletedVehicleType) {
        return {
          status: true,
          message: 'Vehicle type deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting vehicle type.');
    } catch (error) {
      throw error;
    }
  }


  /**
 * @description
 * Function to restore deleted vehicle-type
 */

  async restoreVehicleType(id: number, auth: any) {
    try {
      //check vehicle with this id present or not ...
      let condition = { id: id, is_deleted: true };
      const vehicleType = await this.vehicleTypeRepository.findOne(
        this.select,
        condition
      );
      if (!vehicleType) {
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
          id: vehicleType?.id,
          is_deleted: true
        }
      };

      const updatedVehicleType = await this.vehicleTypeRepository.update(restoreCondition.where, restoreCondition.payload);
      if (updatedVehicleType) {
        return {
          status: true,
          message: 'Vehicle type restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring vehicle type.');

    } catch (error) {
      throw error
    }
  }





}
