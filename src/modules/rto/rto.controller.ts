/**
 * @fileoverview
 * Rto controller file to handle all the rto type requests.
 *
 * @version
 * API version 1.0.
 *
 * @author
 * KATALYST TEAM.
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
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { RtoService } from './rto.service';
import { Auth, Data, Id, Page, QueryString } from 'src/common/decorators';
import { MS_CONFIG } from 'ms.config';
import { RTO_MASTER_MS_PATTERN } from './pattern';
import { toggleRTOBody } from './types';

@Controller('rto')
export class RtoController {
  constructor(private readonly rtoService: RtoService) {}

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
   * Message pattern handler to fetchAll rto information
   */
  @MessagePattern(RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllRto)
  async fetchAllRto(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.rtoService.fetchAllRto(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll deleted rto information
   */
  @MessagePattern(RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedRto)
  async fetchAllDeletedRto(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.rtoService.fetchAllDeletedRto(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch rto information of given rto id
   */
  @MessagePattern(RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].findRtoById)
  async findRtoById(@Id() id: number) {
    try {
      return await this.rtoService.findRtoById(id);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create rto
   */
  @MessagePattern(RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].createRto)
  async createRto(@Auth() auth: any, @Data() data: any) {
    try {
      return await this.rtoService.createRto(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to rto visibility i.e: active,inactive
   */
  @MessagePattern(
    RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleRtoVisibility,
  )
  async toggleRtoVisibility(
    @Id() id: number,
    @Auth() auth: any,
    @Data() data: toggleRTOBody,
  ) {
    try {
      return await this.rtoService.toggleRtoVisibility(id, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update rto
   */
  @MessagePattern(RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].updateRto)
  async updateRto(@Id() id: number, @Auth() auth: any, @Data() data: any) {
    try {
      return await this.rtoService.updateRto(id, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete rto
   */
  @MessagePattern(RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteRto)
  async deleteRto(@Id() id: number, @Auth() auth: any) {
    try {
      return await this.rtoService.deleteRto(id, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted rto
   */
  @MessagePattern(RTO_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreRto)
  async restoreRto(@Id() id: number, @Auth() auth: any) {
    try {
      return await this.rtoService.restoreRto(id, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
