import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { EEnvVariables } from './common/constants/env-variables';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 
  const configService = app.get(ConfigService);

  const PORT = configService.get(EEnvVariables.PORT);
  const CLIENT_URL = configService.get(EEnvVariables.CLIENT_URL);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: CLIENT_URL,
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(PORT);
}
bootstrap();
