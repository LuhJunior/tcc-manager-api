import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PdfService],
})
export class PdfModule {}
