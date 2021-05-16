import { Module } from '@nestjs/common';
import { DataUploadController } from './data.upload.controller';
import { DataUploadService } from './data.upload.service';

@Module({
  imports: [],
  controllers: [DataUploadController],
  providers: [DataUploadService],
})
export class DataUploadModule {}
