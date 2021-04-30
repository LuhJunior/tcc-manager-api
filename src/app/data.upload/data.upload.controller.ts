import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { DataUploadService } from "./data.upload.service";

@Controller()
export class DataUploadController {
  constructor(
    private readonly dataUploadService: DataUploadService,
  ) {}

  @Post('firebase/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.dataUploadService.uploadFile(files.map(({ originalname, buffer }) => ({ filename: originalname, buffer })));
  }
}