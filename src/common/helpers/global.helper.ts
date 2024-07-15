import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GlobalHelper {
  constructor(private configService: ConfigService) {}

  /**
   * @description
   * Function to convert string into capital format
   */
  public convertToTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
}
