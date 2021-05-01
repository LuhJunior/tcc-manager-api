export class FileDto {
  /**
   * File's name
   * @example 'A file.pdf'
   */
  filename: string;

  /**
   * File buffer
   */
  buffer: Buffer;
}

class FilesUploadDto {
  // @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: Express.Multer.File;
}
