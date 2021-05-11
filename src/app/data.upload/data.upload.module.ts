import { Module } from '@nestjs/common';
import { DataUploadController } from './data.upload.controller';
import { DataUploadService } from './data.upload.service';
import { PdfModule } from '../pdf/pdf.module';


@Module({
  imports: [PdfModule],
  controllers: [DataUploadController],
  providers: [DataUploadService],
})
export class DataUploadModule {}
