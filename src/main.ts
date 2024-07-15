require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import {
  Transport,
  MicroserviceOptions,
  RpcException,
} from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MS_CONFIG } from 'ms.config';
import { AppModule } from './app.module';

const logger = new Logger('Master Microservice');
async function bootstrap() {
  const transport = MS_CONFIG.transport;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    MS_CONFIG[transport]
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Remove unknown parameter from payload
      forbidNonWhitelisted: false, //Display error if we have some unknown parameter in request payload
      transform: true,
      forbidUnknownValues: false,
      disableErrorMessages: false,
      validateCustomDecorators: true,
      exceptionFactory: (errors) => {
        return new RpcException({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: errors.reduce((acc, e) => {
            const handleNestedErrors = (error: any) => {
              if (error.children && error.children.length > 0) {
                return error.children.reduce(
                  (nestedAcc: any, nestedError: any) => {
                    return {
                      ...nestedAcc,
                      ...handleNestedErrors(nestedError),
                    };
                  },
                  {},
                );
              } else {
                return {
                  [error.property]: Object.values(error.constraints),
                };
              }
            };

            return {
              ...acc,
              ...handleNestedErrors(e),
            };
          }, {}),
        });
      },
    }),
  );
  await app.listen();
  logger.log(`Master microservice is listening at ${transport} Port: ${process.env.PORT} Timezone: ${process.env.TZ}, Current Time: ${new Date().toString()}`);
}
bootstrap();
