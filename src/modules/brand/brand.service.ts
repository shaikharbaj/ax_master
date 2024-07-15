/**
 * @fileoverview
 * vehicle type service file to handle all vehicle type logic functionality.
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
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from './repository';

@Injectable()
export class BrandService {
  constructor(private brandRepository: BrandRepository) { }

}
