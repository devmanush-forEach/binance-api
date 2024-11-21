import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Upload a single file to a specific folder.
   * @param folderName The folder name.
   * @param file The file to upload.
   * @returns The download URL of the uploaded file.
   */
  @Post('upload/:folderName')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @Param('folderName') folderName: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.fileService.uploadSingleFile(file, folderName);
    return { url };
  }

  /**
   * Upload multiple files to a specific folder.
   * @param folderName The folder name.
   * @param files The files to upload.
   * @returns An array of download URLs for the uploaded files.
   */
  @Post('upload-multiple/:folderName')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @Param('folderName') folderName: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const urls = await this.fileService.uploadMultipleFiles(files, folderName);
    return { urls };
  }
}
