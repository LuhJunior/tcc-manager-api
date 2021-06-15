import { Module } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { ProfessorModule } from './professor/professor.module';
import { ProjectModule } from './project/project.module';
import { DataUploadModule } from './data.upload/data.upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { RegisterModule } from './register/register.module';
import { SemesterModule } from './semester/semester.module';
import { ClassModule } from './class/class.module';

MulterModule.register({
  storage: memoryStorage(),
});

@Module({
  imports: [
    AuthModule,
    DataUploadModule,
    ProfessorModule,
    ProjectModule,
    UserModule,
    StudentModule,
    RegisterModule,
    SemesterModule,
    ClassModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
