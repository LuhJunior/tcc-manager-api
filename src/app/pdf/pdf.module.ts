import { Module } from '@nestjs/common';
// import { ProfessorController } from './pdf.controller';
import { PdfService } from './pdf.service';
// import { PrismaService } from '../prisma/prisma.service';


@Module({
  imports: [],
  controllers: [],
  providers: [PdfService],
})
export class PdfModule {}
