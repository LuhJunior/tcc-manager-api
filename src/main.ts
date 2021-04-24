import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

(async function () {
  const app = await NestFactory.create(AppModule);
  await app.listen(parseInt(process.env.PORT, 10));
})();
