import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.enableCors();

  const db = new DocumentBuilder()
    .setTitle('TCC Manager API')
    .setDescription('API para gerenciar dados dos projetos de TCC')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, db);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);
})();
