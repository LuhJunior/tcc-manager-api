import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { DataUploadService } from "./data.upload.service";
import { Roles } from "../../decorators/roles.decorator";
import { Role } from "../../enums/role.enum";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags('Data Upload')
@Controller()
export class DataUploadController {
  constructor(
    private readonly dataUploadService: DataUploadService,
  ) {}

  @Post('data-upload')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Professor, Role.Student)
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
}