/**
 * @fileoverview
 * state service file to handle all state logic functionality.
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
import { CountryRepository } from '../country/repository/country.repository';
import { StateRepository } from './repository/state.repository';
import { GlobalHelper } from 'src/common/helpers';
import {
  CreateStateBody,
  toggleStateVisibilityBody,
  UpdateStateBody,
} from './types';

@Injectable()
export class StateService {
  constructor(
    private globalHelper: GlobalHelper,
    private countryRepository: CountryRepository,
    private stateRepository: StateRepository,
  ) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    id: true,
    country_id: true,
    state_name: true,
    short_code: true,
    is_active: true,
    is_deleted: true,
  };

  /**
   * @description
   * Function to check if state exist by given condition
   */
  async isExistByCondition(condition: any) {
    const state = await this.stateRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return state;
  }

  /**
   * @description
   * Function to fetch all the state
   */
  async fetchAllState(page: number, searchText: string) {
    try {
      const state = await this.stateRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: false,
        },
      );
      return {
        status: true,
        message: 'All states fetched successfully',
        data: state,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all the state
   */
  async fetchAllDeletedState(page: number, searchText: string) {
    try {
      const state = await this.stateRepository.findManyWithPaginate(
        page,
        this.select,
        {
          is_deleted: true,
        },
      );
      return {
        status: true,
        message: 'All deleted states fetch successfully',
        data: state,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the state by id
   */
  async findStateById(id: number) {
    try {
      const state = await this.stateRepository.findOne(this.select, { id: id });
      if (!state) {
        throw new NotFoundException('Data not found');
      }
      return {
        status: true,
        message: 'state fetched successfully',
        data: state,
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * @description
   * Function to create new state
   */
  async createState(auth: any, payload: CreateStateBody) {
    try {
      const isExistByCondition = await this.countryRepository.findOne(
        { id: true, country_name: true, iso_code: true },
        { id: +payload.country_id },
      );

      if (!isExistByCondition) {
        throw new NotFoundException('Country does not exist.');
      }
      //   // Checking if requested state already exist
      const isExistState = await this.isExistByCondition({
        AND: [
          { country_id: isExistByCondition.id },
          { state_name: payload.name },
        ],
      });
      if (isExistState && !isExistState?.is_deleted) {
        throw new BadRequestException('State already exist.');
      }
      const stateCondition = {
        create: {
          country_id: isExistByCondition.id,
          state_name: this.globalHelper.convertToTitleCase(payload.name),
          short_code: payload.short_code,
          is_active: payload.is_active === 'true' ? true : false,
          created_by: auth?.id,
        },
        update: {
          country_id: isExistByCondition.id,
          state_name: this.globalHelper.convertToTitleCase(payload.name),
          short_code: payload.short_code,
          is_active: payload.is_active === 'true' ? true : false,
          created_at: new Date(),
          created_by: auth?.id,
          updated_by: null,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          country_id_state_name: {
            country_id: isExistByCondition.id,
            state_name: this.globalHelper.convertToTitleCase(payload.name),
          },
        },
      };
      const createdState = await this.stateRepository.upsert(
        stateCondition.create,
        stateCondition.update,
        stateCondition.where,
      );
      if (createdState) {
        return {
          status: true,
          message: 'state created successfully',
        };
      }
      throw new BadRequestException('Error while creating state.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the state details
   */
  async updateState(id: number, auth: any, payload: UpdateStateBody) {
    try {
      //Checking whether state esits or not
      const stateExist = await this.stateRepository.findOne(
        { id: true, state_name: true, image: true, country_id: true },
        { id: id },
      );
      if (!stateExist) {
        throw new NotFoundException('State information not found.');
      }

      const isExistByCondition = await this.countryRepository.findOne(
        { id: true, country_name: true, iso_code: true },
        {
          id: stateExist.country_id,
        },
      );
      if (!isExistByCondition.id) {
        throw new NotFoundException('Country does not exist.');
      }

      //checking another state exist with same name..
      const anotherStateExistWithSameName = await this.isExistByCondition({
        id: { not: id },
        AND: [
          { country_id: isExistByCondition.id },
          { state_name: payload.name },
          { is_deleted: false },
        ],
      });

      if (anotherStateExistWithSameName) {
        throw new BadRequestException('State already exist.');
      }

      //checking another state exist with same name in deleted records
      const anotherStateExistWithSameNameWithDeleted =
        await this.isExistByCondition({
          // id: { not: id },
          is_deleted: true,
          AND: [
            { country_id: isExistByCondition.id },
            { state_name: this.globalHelper.convertToTitleCase(payload.name) },
          ],
        });

      if (anotherStateExistWithSameNameWithDeleted) {
        throw new BadRequestException(
          'State already exist, In deleted records.',
        );
      }

      const statePayload = {
        country_id: isExistByCondition.id,
        state_name: this.globalHelper.convertToTitleCase(payload.name),
        short_code: payload.short_code,
        is_active: payload.is_active === 'true' ? true : false,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updatedState = await this.stateRepository.update(
        { id: id },
        statePayload,
      );

      if (updatedState) {
        return {
          status: true,
          message: 'state updated successfully',
        };
      }
      throw new BadRequestException('Error while updating state.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore the deleted state details
   */
  async restoreDeletedState(id: number, auth: any) {
    try {
      //Checking whether state exist or not
      const stateExist = await this.stateRepository.findOne(
        { id: true, state_name: true, image: true, country_id: true },
        { id: id, is_deleted: true },
      );
      if (!stateExist) {
        throw new NotFoundException('State information not found.');
      }

      const statePayload = {
        is_active: true,
        created_at: new Date(),
        updated_by: null,
        created_by: auth?.id,
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
      };
      const restoredState = await this.stateRepository.update(
        { id: id, is_deleted: true },
        statePayload,
      );
      if (restoredState) {
        return {
          status: true,
          message: 'state restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring state.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the state
   */
  async deleteState(id: number, auth: any) {
    try {
      // Checking if record is deleted or not
      const isExist = await this.isExistByCondition({
        id: id,
      });
      if (!isExist) {
        throw new NotFoundException('State information not found.');
      }
      const statePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const state = await this.stateRepository.update({ id: id }, statePayload);
      if (state) {
        return {
          status: true,
          message: 'State deleted successfully',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the state status i.e: active and inactive
   */
  async toggleStateVisibility(
    id: number,
    auth: any,
    payload: toggleStateVisibilityBody,
  ) {
    try {
      // Checking if record is deleted or not
      const isExist = await this.isExistByCondition({
        id: id,
        is_deleted: false,
      });
      if (!isExist) {
        throw new NotFoundException('State information not found.');
      }
      const statePayload = {
        ...payload,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const state = await this.stateRepository.update({ id }, statePayload);
      if (state) {
        return {
          status: true,
          message: 'State visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating state visibility.');
    } catch (error) {
      throw error;
    }
  }
}
