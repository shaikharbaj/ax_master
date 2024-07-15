/**
 * @fileoverview
 * Vehicle type controller file to handle all the vehicle type requests.
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
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  GatewayTimeoutException,
  NotFoundException,
  Param,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { MS_CONFIG } from 'ms.config';
import { VEHICLE_TYPE_PATTERN } from './pattern';
import { Auth, Id, Data, Page, QueryString } from 'src/common/decorators';
import { CreateVehicleTypeDto, UpdateVehicleTypeDto, ToggleVehicleTypeVisibilityDto } from './dto';


@Controller()
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) { }

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
   * Message pattern handler to fetch all vehicle-type without paginate
   */
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].fetchAllVehicleType)
  // async fetchAllVehicleTypes(@Page() page: number, @QueryString() { searchText }: any) {
  //   try {
  //     return await this.vehicleTypeService.fetchAllVehicleType(page, searchText);
  //   } catch (error) {
  //     throw this.exceptionHandler(error);
  //   }
  // }

  /**
 * @description
 * Message pattern handler to fetch all deleted vehicle-type with paginate
 */
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].fetchAllDeletedVehicleType)
  // async fetchAllDeletedVehicleType(
  //   @Page() page: number,
  //   @QueryString() { searchText }: any
  // ) {
  //   return await this.vehicleTypeService.fetchAllDeletedVehicleType(
  //     page, searchText
  //   );
  // }

  /**
   * @description
   * Message pattern handler to fetch vehicle-type information of given id
   */
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].findVehicleTypeById)
  // async findVehicleTypeById(@Id() id: number) {
  //   try {
  //     return await this.vehicleTypeService.findVehicleTypeById(id);
  //   } catch (error) {
  //     throw this.exceptionHandler(error);
  //   }
  // }

  /**
   * @description
   * Message pattern handler to create vehicle-type
   */
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].createVehicleType)
  // async createVehicleType(@Auth() auth: any, @Data() data: CreateVehicleTypeDto) {
  //   try {
  //     return await this.vehicleTypeService.createVehicleType(auth, data);
  //   } catch (error) {
  //     throw this.exceptionHandler(error);
  //   }
  // }

  /**
* @description
* Message pattern handler to vehicle-type visibility i.e: active,inactive
*/
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].toggleVehicleTypeVisibility)
  // async toggleVehicleTypeVisibility(
  //   @Id() id: number,
  //   @Data() data: ToggleVehicleTypeVisibilityDto,
  //   @Auth() auth: any
  // ) {
  //   try {
  //     return await this.vehicleTypeService.toggleVehicleTypeVisibility(id, data, auth);
  //   } catch (error) {
  //     throw this.exceptionHandler(error)
  //   }
  // }

  /**
   * @description
   * Message pattern handler to update vehicle-type
   */
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].updateVehicleType)
  // async updateVehicleType(
  //   @Id() id: number,
  //   @Data() data: UpdateVehicleTypeDto,
  //   @Auth() auth: any
  // ) {
  //   try {
  //     return await this.vehicleTypeService.updateVehicleType(id, data, auth);
  //   } catch (error) {
  //     throw this.exceptionHandler(error);
  //   }
  // }

  /**
   * @description
   * Message pattern handler to delete vehicle-type
   */
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].deleteVehicleType)
  // async deleteVehicleType(@Id() id: number, @Auth() auth: any) {
  //   try {
  //     return await this.vehicleTypeService.deleteVehicleType(id, auth);
  //   } catch (error) {
  //     throw this.exceptionHandler(error);
  //   }
  // }

  /**
  * @description
  * Message pattern handler to restore vehicle-type
  */
  // @MessagePattern(VEHICLE_TYPE_PATTERN[MS_CONFIG.transport].restoreVehicleType)
  // async restoreVehicleType(@Id() id: number, @Auth() auth: any) {
  //   try {
  //     return await this.vehicleTypeService.restoreVehicleType(id, auth);
  //   } catch (error) {
  //     throw this.exceptionHandler(error);
  //   }
  // }
}
