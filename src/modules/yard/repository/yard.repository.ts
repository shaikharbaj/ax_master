import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from 'src/modules/prisma/paginator';

//Defining per page record in pagination
const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class yardRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOneWithoutDelete(select: any, where: any = {}) {
    return this.prismaService.yard.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any = {}) {
    return this.prismaService.yard.findFirst({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return this.prismaService.yard.create({ data: payload });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any = {}) {
    return this.prismaService.yard.findMany({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition with pagination
   */
  async findManyWithPaginate(page: number, select: any, where: any = {}) {
    const pageNumber = page ? page : 1;
    return paginate(
      this.prismaService.yard,
      {
        select: select,
        where: {
          is_deleted: false,
          ...where,
        },
      },
      { page: pageNumber },
    );
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any) {
    return this.prismaService.yard.update({
      where: {
        is_deleted: false,
        ...where,
      },
      data: payload,
    });
  }

  /**
   * @description
   * Function to upsert record
   */
  upsert(create: any, update: any, where: any) {
    return this.prismaService.yard.upsert({
      create: create,
      update: update,
      where: where,
    });
  }
}
