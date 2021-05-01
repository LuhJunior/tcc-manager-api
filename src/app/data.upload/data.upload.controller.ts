import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { DataUploadService } from "./data.upload.service";

@ApiTags('Data Upload')
@Controller()
export class DataUploadController {
  constructor(
    private readonly dataUploadService: DataUploadService,
  ) {}

  @Post('firebase/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'array',
    description: 'Files to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.dataUploadService.sendFileUpload(files.map(({ originalname, buffer }) => ({ filename: originalname, buffer })));
  }
}