// src/aws/aws.controller.ts

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/aws.dto';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  /**
   * Endpoint to upload an image to AWS S3.
   * URL: POST /aws/upload-image
   * Body: multipart/form-data with 'file' field and optional 'title' and 'description'
   */
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException(
              'Only JPG, JPEG, and PNG files are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: any,
    @Body() uploadImageDto: UploadImageDto,
  ): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new BadRequestException('File is not provided');
    }

    const imageUrl = await this.awsService.uploadImage(file);

    // Optionally, handle uploadImageDto (title, description) here or store metadata as needed

    return { imageUrl };
  }
}
