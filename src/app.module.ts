import { Module } from '@nestjs/common';
import { ProfessorModule } from './app/professor/professor.module';
import { ProjectModule } from './app/project/project.module';

@Module({
  imports: [ProfessorModule, ProjectModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
