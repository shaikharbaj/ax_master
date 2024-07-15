/**
 * @fileoverview
 * rto service file to handle all rto logic functionality.
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
import { GlobalHelper } from 'src/common/helpers';
import { RtoRepository } from './repository';
import { toggleRTOBody } from './types';
import { StateRepository } from '../state/repository';

@Injectable()
export class RtoService {
  constructor(
    private rtoRepository: RtoRepository,
    private stateRepository: StateRepository,
  ) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    id: true,
    reg_no: true,
    address: true,
    rto_state_id: true,
    rto_state_name: true,
    is_active: true,
    created_at: true,
    is_deleted: true,
  };

  /**
   * @description
   * Function to check if rto exist by given condition
   */
  async isExistByCondition(condition: any) {
    const rto = await this.rtoRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return rto;
  }

  /**
   * @description
   * Function to fetch all the rto
   */
  async fetchAllRto(page: number, searchText: string) {
    try {
      const rto = await this.rtoRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: false,
        },
      );
      return {
        status: true,
        message: 'Rto fetched successfully.',
        data: rto,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted the rto
   */
  async fetchAllDeletedRto(page: number, searchText: string) {
    try {
      const rto = await this.rtoRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: true,
        },
      );
      return {
        status: true,
        message: 'Deleted Rto fetched successfully.',
        data: rto,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the rto by id
   */
  async findRtoById(id: number) {
    try {
      let condition = { id: id };
      const rto = await this.rtoRepository.findOne(this.select, condition);

      if (!rto) {
        throw new NotFoundException('Data not found');
      }
      return {
        status: true,
        message: 'rto fetched successfully',
        data: rto,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create rto
   */
  async createRto(auth: any, payload: any) {
    try {
      //check state is exist or not...
      const isStateExist = await this.stateRepository.findOne(
        { id: true, state_name: true },
        { id: +payload.rto_state_id },
      );
      if (!isStateExist) {
        throw new NotFoundException('state does not exist.');
      }
      const isRtoExistByCondition = await this.isExistByCondition({
        id: +payload.reg_no,
      });

      if (isRtoExistByCondition && !isRtoExistByCondition?.is_deleted) {
        throw new BadRequestException('Rto is already exist.');
      }

      const rtoCondition = {
        create: {
          reg_no: payload.reg_no,
          address: payload.address,
          rto_state_id: payload.rto_state_id,
          rto_state_name: payload.rto_state_name,
          is_active: payload.is_active === true ? true : false,
          created_by: auth.id,
        },
        update: {
          reg_no: payload.reg_no,
          address: payload.address,
          rto_state_id: payload.rto_state_id,
          rto_state_name: payload.rto_state_name,
          is_active: payload.is_active === true ? true : false,
          created_at: new Date(),
          created_by: auth.id,
          updated_by: null,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          reg_no: +payload.reg_no,
        },
      };
      const createdRto = await this.rtoRepository.upsert(
        rtoCondition.create,
        rtoCondition.update,
        rtoCondition.where,
      );
      if (createdRto) {
        return {
          status: true,
          message: 'rto created successfully',
        };
      }
      throw new BadRequestException('Error while creating rto.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the rto status i.e: active and inactive
   */
  async toggleRtoVisibility(id: number, auth: any, payload: toggleRTOBody) {
    try {
      //Checking rto exist or not
      const rto = await this.rtoRepository.findOne(this.select, {
        id: +id,
      });
      if (!rto) {
        throw new NotFoundException('No data found.');
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updateRto = await this.rtoRepository.update(
        { id: rto.id },
        updatePayload,
      );
      if (updateRto) {
        return {
          status: true,
          message: 'Rto visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating rto visibility.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the rto details
   */
  async updateRto(id: number, auth: any, payload: any) {
    try {
      //Checking rto record exist or not
      let condition = { id: id };
      const rto = await this.rtoRepository.findOne(this.select, condition);
      if (!rto) {
        throw new NotFoundException('Data not found');
      }

      //check state is exist or not...
      const isStateExist = await this.stateRepository.findOne(
        { id: true, state_name: true },
        { id: +payload.rto_state_id },
      );

      if (!isStateExist) {
        throw new NotFoundException('state does not exist.');
      }

      //checking another rto exist with same regno...!
      const anotherRtoExistWithSameRegNo = await this.isExistByCondition({
        id: { not: id },
        AND: [{ reg_no: +payload.reg_no }],
      });

      if (anotherRtoExistWithSameRegNo) {
        throw new BadRequestException('Rto already exist.');
      }

      //checking another rto exist with same name in deleted records
      const anotherRtoExistWithSameRegNoWithDeleted =
        await this.isExistByCondition({
          is_deleted: true,
          AND: [{ reg_no: +payload.reg_no }],
        });
      if (anotherRtoExistWithSameRegNoWithDeleted) {
        throw new BadRequestException('rto already exist, In deleted records.');
      }
      const rtoPayload = {
        reg_no: payload.reg_no,
        address: payload.address,
        rto_state_id: payload.rto_state_id,
        rto_state_name: payload.rto_state_name,
        is_active: payload.is_active === true ? true : false,
        updated_by: auth.id,
      };
      const updateRTO = await this.rtoRepository.update({ id: id }, rtoPayload);
      if (updateRTO) {
        return {
          status: true,
          message: 'RTO updated successfully',
        };
      }
      throw new BadRequestException('Error while updating rto.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the rto...
   */
  async deleteRto(id: number, auth: any) {
    try {
      // Checking if record is deleted or not
      const rto = await this.rtoRepository.findOne(this.select, {
        id: id,
      });
      if (!rto) {
        throw new NotFoundException('Data not found');
      }
      const updatePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedRto = await this.rtoRepository.update(
        { id: rto.id },
        updatePayload,
      );
      if (rto) {
        return {
          status: true,
          message: 'Rto deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting rto.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore deleted the rto details
   */
  async restoreRto(id: number, auth: any) {
    try {
      //check rto with this id present or not ...
      let condition = { id: id, is_deleted: true };
      const rto = await this.rtoRepository.findOne(this.select, condition);
      if (!rto) {
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
          id: rto?.id,
          is_deleted: true,
        },
      };
      const updatedRto = await this.rtoRepository.update(
        restoreCondition.where,
        restoreCondition.payload,
      );
      if (updatedRto) {
        return {
          status: true,
          message: 'rto restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring rto.');
    } catch (error) {
      throw error;
    }
  }
}
