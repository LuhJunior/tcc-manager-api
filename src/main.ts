import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import config from './config/configuration';

(async function () {
  if (config.nodeEnv === "production") {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.projectId,
        privateKey: config.privateKey,
        clientEmail: config.clientEmail,
      }),
    });
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(parseInt(process.env.PORT, 10));
})();
