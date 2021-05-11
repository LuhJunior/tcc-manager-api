import { Module } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { ProfessorModule } from './professor/professor.module';
import { ProjectModule } from './project/project.module';
import { DataUploadModule } from './data.upload/data.upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';

MulterModule.register({
  storage: memoryStorage(),
});

@Module({
  imports: [DataUploadModule, ProfessorModule, ProjectModule, AuthModule, UserModule, StudentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
