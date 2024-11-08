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
import { UploadImageDto, SendSmsDto } from './dto/aws.dto';

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
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('File is not provided');
    }
    return await this.awsService.uploadFile(file);
  }

  /**
   * Endpoint to send an SMS message via AWS SNS.
   * URL: POST /aws/send-sms
   * Body: JSON with 'phoneNumber' and 'message'
   */
  @Post('send-sms')
  async sendSms(
    @Body() sendSmsDto: SendSmsDto,
  ): Promise<{ messageId: string }> {
    const { phoneNumber, message } = sendSmsDto;

    try {
      const messageId = await this.awsService.sendSms(phoneNumber, message);
      return { messageId };
    } catch (error) {
      throw new BadRequestException('Failed to send SMS');
    }
  }
}
