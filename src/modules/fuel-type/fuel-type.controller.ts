/**
 * @fileoverview
 * Fuel type controller file to handle all the fuel type requests.
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
import { BadGatewayException, BadRequestException, ConflictException, Controller, ForbiddenException, GatewayTimeoutException, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { FuelTypeService } from './fuel-type.service';
import { FUEL_TYPE_MASTER_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { Auth, Data, Id, Page, QueryString } from 'src/common/decorators';
import { CreateFuelTypeDto, ToggleFuelTypeVisibilityDto, UpdateFuelTypeDto } from './dto';

@Controller()
export class FuelTypeController {
    constructor(private readonly fuelTypeService: FuelTypeService) { }

    /**
   * @description
   * Message format exception
   */
    exceptionHandler(error: any) {
        if (error instanceof BadRequestException) {
            return new RpcException({
                statusCode: 400,
                message: error.message,
            });
        } else if (error instanceof UnauthorizedException) {
            return new RpcException({
                statusCode: 401,
                message: error.message,
            });
        } else if (error instanceof ForbiddenException) {
            return new RpcException({
                statusCode: 403,
                message: error.message,
            });
        } else if (error instanceof NotFoundException) {
            return new RpcException({
                statusCode: 404,
                message: error.message,
            });
        } else if (error instanceof ConflictException) {
            return new RpcException({
                statusCode: 409,
                message: error.message,
            });
        } else if (error instanceof BadGatewayException) {
            return new RpcException({
                statusCode: 502,
                message: error.message,
            });
        } else if (error instanceof ServiceUnavailableException) {
            return new RpcException({
                statusCode: 503,
                message: error.message,
            });
        } else if (error instanceof GatewayTimeoutException) {
            return new RpcException({
                statusCode: 504,
                message: error.message,
            });
        } else {
            return new RpcException({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }


    /**
  * @description
  * Message pattern handler to fetch all fuel-type
  */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllFuelType)
    async fetchAllFuelType(@Page() page: number, @QueryString() { searchText }: any) {
        try {
            return await this.fuelTypeService.fetchAllFuelType(page, searchText);
        } catch (error) {
            throw this.exceptionHandler(error);
        }
    }

    /**
 * @description
 * Message pattern handler to fetch all deleted fuel-type with paginate
 */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedFuelType)
    async fetchAllDeletedFuelType(
        @Page() page: number,
        @QueryString() { searchText }: any
    ) {
        try {
            return await this.fuelTypeService.fetchAllDeletedFuelType(
                page,
                searchText
            );
        } catch (error) {
            throw this.exceptionHandler(error);
        }
    }


    /**
     * @description
     * Message pattern handler to fetch fuel-type information of given id
     */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].findFuelTypeById)
    async findFuelTypeById(@Id() id: number) {
        try {
            return await this.fuelTypeService.findFuelTypeById(id);
        } catch (error) {
            throw this.exceptionHandler(error);
        }
    }


    /**
     * @description
     * Message pattern handler to create fuel-type
     */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].createFuelType)
    async createFuelType(@Auth() auth: any, @Data() data: CreateFuelTypeDto) {
        try {
            return await this.fuelTypeService.createFuelType(auth, data);
        } catch (error) {
            throw this.exceptionHandler(error);
        }

    }

    /**
     * @description
     * Message pattern handler to fuel-type visibility i.e: active,inactive
     */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleFuelTypeVisibility)
    toggleFuelTypeVisibility(
        @Id() id: number,
        @Auth() auth: any,
        @Data() data: ToggleFuelTypeVisibilityDto,
    ) {
        try {
            return this.fuelTypeService.toggleFuelTypeVisibility(id, auth, data);
        } catch (error) {
            throw this.exceptionHandler(error);
        }
    }

    /**
     * @description
     * Message pattern handler to update fuel-type
     */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].updateFuelType)
    updateFuelType(
        @Id() id: number,
        @Auth() auth: any,
        @Data() data: UpdateFuelTypeDto,
    ) {
        try {
            return this.fuelTypeService.updateFuelType(id, auth, data);
        } catch (error) {
            throw this.exceptionHandler(error);
        }
    }

    /**
     * @description
     * Message pattern handler to delete fuel-type
     */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteFuelType)
    deleteFuelType(@Id() id: number, @Auth() auth: any) {
        try {
            return this.fuelTypeService.deleteFuelType(id, auth);
        } catch (error) {
            throw this.exceptionHandler(error);
        }
    }



    /**
    * @description
    * Message pattern handler to restore fuel-type
    */
    @MessagePattern(FUEL_TYPE_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreFuelType)
    restoreFuelType(@Id() id: number, @Auth() auth: any) {
        try {
            return this.fuelTypeService.restoreFuelType(id, auth);
        } catch (error) {
            throw this.exceptionHandler(error);
        }
    }

}
