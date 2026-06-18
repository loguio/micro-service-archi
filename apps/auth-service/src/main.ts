import { otelSDK } from './otel-sdk';
// Initialize OTel SDK before importing NestJS modules
otelSDK.start();

import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
