/**
 * @fileoverview
 * city controller file to handle all the city requests.
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
  Controller,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CityService } from './city.service';
import { MASTER_MS_CITY_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { CreateCityDto, ToggleCityDto, UpdateCityDto } from './dto';
import { Auth, Data, Id, Page, QueryString } from 'src/common/decorators';

@Controller()
export class CityController {
  constructor(private readonly cityService: CityService) {}
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
    } else {
      return new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all city
   */
  @MessagePattern(MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].fetchAllCity)
  async fetchAllCity(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.cityService.fetchAllCity(+page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all Deleted city
   */
  @MessagePattern(
    MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].fetchAllDeletedCity,
  )
  async fetchAllDeletedCity(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.cityService.fetchAllDeletedCity(+page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch city information of given city id
   */
  @MessagePattern(MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].findCityById)
  async findCityById(@Id() id: number) {
    try {
      return await this.cityService.findCityById(id);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create city
   */
  @MessagePattern(MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].createCity)
  async createCity(@Auth() auth: any, @Data() data: CreateCityDto) {
    try {
      return await this.cityService.createCity(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

   /**
   * @description
   * Message pattern handler to update city
   */
   @MessagePattern(MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].updateCity)
   async updateCity(
     @Id() id: number,
     @Auth() auth:any,
     @Data() data: UpdateCityDto,
   ) {
     try {
       return await this.cityService.updateCity(+id,auth, data);
     } catch (error) {
       throw this.exceptionHandler(error);
     }
   }


  /**
   * @description
   * Message pattern handler to restore deleted city
   */
  @MessagePattern(
    MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].restoreDeletedCity,
  )
  async restoreDeletedCity(@Id() id: number, @Auth() auth: any) {
    try {
      return await this.cityService.restoreDeletedCity(id, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete city
   */
  @MessagePattern(MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].deleteCity)
  async deleteCity(@Id() id: number, @Auth() auth: any) {
    try {
      return await this.cityService.deleteCity(id, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to city visibility i.e: active,inactive
   */
  @MessagePattern(
    MASTER_MS_CITY_PATTERN[MS_CONFIG.transport].toggleCityVisibility,
  )
  async toggleVehicleTypeVisibility(
    @Auth() auth: any,
    @Id() id: number,
    @Data() data: ToggleCityDto,
  ) {
    try {
      return await this.cityService.toggleCityVisibility(id, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }


}
