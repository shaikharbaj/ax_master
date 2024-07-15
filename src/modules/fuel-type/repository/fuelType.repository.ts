/**
 * @fileoverview
 * Fuel type repository file to handle all fuel type table operations
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
import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/modules/prisma/paginator';
import { PrismaService } from 'src/modules/prisma/prisma.service';

const paginate: PaginateFunction = paginator({ perPage: 10 });


@Injectable()
export class FuelTypeRepository {
    constructor(private prismaService: PrismaService) { }

    /**
 * @description
 * Function to find first matching record for given condition
 */
    async findOneWithoutDelete(select: any, where: any = {}) {
        return this.prismaService.fuelType.findFirst({
            select: select,
            where: where,
        });
    }

    /**
       * @description
       * Function to find first matching record for given condition
       */
    async findOne(select: any, where: any = {}) {
        return this.prismaService.fuelType.findFirst({
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
        return this.prismaService.fuelType.create({ data: payload });
    }


    /**
     * @description
     * Function to fetch matching records for given condition without pagination
     */
    async findMany(select: any, where: any = {}) {
        return this.prismaService.fuelType.findMany({
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
            this.prismaService.fuelType,
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
        return this.prismaService.fuelType.update({
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
        return this.prismaService.fuelType.upsert({
            create: create,
            update: update,
            where: where,
        });
    }




}
