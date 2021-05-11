import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { DataUploadService, LocalStorageService } from "./data.upload.service";
import { PdfService } from "../pdf/pdf.service";

@ApiTags('Data Upload')
@Controller()
export class DataUploadController {
  constructor(
    private readonly dataUploadService: DataUploadService,
    // private readonly pdfService: PdfService,
  ) {}

  @Post('data-upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({
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
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.dataUploadService.sendFileUpload(files.map(({ originalname, buffer }) => ({ filename: originalname, buffer })));
  }

  @Post('pdf')
  async savePdf() {
    const localStorageService = new LocalStorageService();
    const pdfService = new PdfService();
    return await localStorageService.sendFileUpload([{ filename: 'teste', buffer: await pdfService.createPdf() }]);
  }
}