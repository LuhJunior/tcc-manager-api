import { Module } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { ProfessorModule } from './app/professor/professor.module';
import { ProjectModule } from './app/project/project.module';
import { DataUploadModule } from './app/data.upload/data.upload.module';
import { MulterModule } from '@nestjs/platform-express';

MulterModule.register({
  storage: memoryStorage(),
});

@Module({
  imports: [DataUploadModule, ProfessorModule, ProjectModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
