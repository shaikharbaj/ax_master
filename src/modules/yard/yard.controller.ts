import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  GatewayTimeoutException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { YardService } from './yard.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { YARD_MASTER_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { Auth, Data, Id, Page, QueryString } from 'src/common/decorators';

@Controller('yard')
export class YardController {
  constructor(private readonly yardService: YardService) {}

  /**
   * @description
   * Message format exception.
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
   * Message pattern handler to fetchAll yard information
   */
  @MessagePattern(YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllYard)
  async fetchAllYard(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.yardService.fetchAllYard(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll deleted yard information
   */
  @MessagePattern(
    YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedYard,
  )
  async fetchAllDeletedYard(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.yardService.fetchAllDeletedYard(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch yard information of given yard id
   */
  @MessagePattern(YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].findYardById)
  async findYardById(@Id() id: number) {
    try {
      return await this.yardService.findYardById(id);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create yard
   */
  @MessagePattern(YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].createYard)
  async createYard(@Auth() auth: any, @Data() data: any) {
    try {
      return await this.yardService.createYard(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to yard visibility i.e: active,inactive
   */
  @MessagePattern(
    YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleYardVisibility,
  )
  async toggleYardVisibility(
    @Id() id: number,
    @Auth() auth: any,
    @Data() data: any,
  ) {
    try {
      return await this.yardService.toggleYardVisibility(id, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update yard
   */
  @MessagePattern(YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].updateYard)
  async updateYard(@Id() id: number, @Auth() auth: any, @Data() data: any) {
    try {
      return await this.yardService.updateYard(id, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete yard
   */
  @MessagePattern(YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteYard)
  async deleteYard(@Id() id: number, @Auth() auth: any) {
    try {
      return await this.yardService.deleteYard(id, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted yard
   */
  @MessagePattern(YARD_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreYard)
  async restoreYard(@Id() id: number, @Auth() auth: any) {
    try {
      return await this.yardService.restoreYard(id, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
