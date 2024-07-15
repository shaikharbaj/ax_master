/**
 * @fileoverview
 * yard service file to handle all yard logic functionality.
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
import { yardRepository } from './repository';
import { GlobalHelper } from 'src/common/helpers';

@Injectable()
export class YardService {
  constructor(
    private yardRepository: yardRepository,
    private globalHelper: GlobalHelper,
  ) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    id: true,
    yard_name: true,
    yard_address: true,
    yard_city_id: true,
    yard_city_name: true,
    yard_state_id: true,
    yard_state_name: true,
    is_active: true,
    yard_associations: true,
  };

  /**
   * @description
   * Function to check if yard exist by given condition
   */
  async isExistByCondition(condition: any) {
    const yard = await this.yardRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return yard;
  }

  /**
   * @description
   * Function to fetch all the yard
   */
  async fetchAllYard(page: number, searchText: string) {
    try {
      const yard = await this.yardRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: false,
        },
      );
      return {
        status: true,
        message: 'Yard fetched successfully.',
        data: yard,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted the yard
   */
  async fetchAllDeletedYard(page: number, searchText: string) {
    try {
      const yard = await this.yardRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: true,
        },
      );
      return {
        status: true,
        message: 'Deleted Yard fetched successfully.',
        data: yard,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the yard by id
   */
  async findYardById(id: number) {
    try {
      let condition = { id: id };
      const yard = await this.yardRepository.findOne(this.select, condition);

      if (!yard) {
        throw new NotFoundException('Data not found');
      }
      return {
        status: true,
        message: 'yard fetched successfully',
        data: yard,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create yard
   */
  async createYard(auth: any, payload: any) {
    try {
      //   if (createdYard) {
      //     return {
      //       status: true,
      //       message: 'yard created successfully',
      //     };
      //   }
      throw new BadRequestException('Error while creating yard.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the yard status i.e: active and inactive
   */
  async toggleYardVisibility(id: number, auth: any, payload: any) {
    try {
      //Checking yard exist or not
      const yard = await this.yardRepository.findOne(this.select, {
        id: +id,
      });
      if (!yard) {
        throw new NotFoundException('No data found.');
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updateYard = await this.yardRepository.update(
        { id: yard.id },
        updatePayload,
      );
      if (updateYard) {
        return {
          status: true,
          message: 'Yard visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating yard visibility.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the yard details
   */
  async updateYard(id: number, auth: any, payload: any) {
    try {
      //Checking yard record exist or not
      let condition = { id: id };
      const yard = await this.yardRepository.findOne(this.select, condition);
      if (!yard) {
        throw new NotFoundException('Data not found');
      }

      //   if (updateYard) {
      //     return {
      //       status: true,
      //       message: 'yard updated successfully',
      //     };
      //   }
      throw new BadRequestException('Error while updating yard.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the yard
   */
  async deleteYard(id: number, auth: any) {
    try {
      // Checking if record is deleted or not
      const yard = await this.yardRepository.findOne(this.select, {
        id: id,
      });
      if (!yard) {
        throw new NotFoundException('Data not found');
      }
      const updatePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedYard = await this.yardRepository.update(
        { id: yard.id },
        updatePayload,
      );
      if (deletedYard) {
        return {
          status: true,
          message: 'Yard deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting yard.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore deleted the yard details
   */
  async restoreYard(id: number, auth: any) {
    try {
      //check yard with this id present or not ...
      let condition = { id: id, is_deleted: true };
      const yard = await this.yardRepository.findOne(this.select, condition);
      if (!yard) {
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
          id: yard?.id,
          is_deleted: true,
        },
      };
      const updatedYard = await this.yardRepository.update(
        restoreCondition.where,
        restoreCondition.payload,
      );
      if (updatedYard) {
        return {
          status: true,
          message: 'yard restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring yard.');
    } catch (error) {
      throw error;
    }
  }
}
