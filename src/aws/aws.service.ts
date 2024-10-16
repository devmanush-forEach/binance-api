import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  public readonly s3: AWS.S3;
  public readonly sqs: AWS.SQS;
  public readonly sns: AWS.SNS;
  public readonly ses: AWS.SES;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get('aws');

    AWS.config.update({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
    });

    this.s3 = new AWS.S3();
    this.sqs = new AWS.SQS();
    this.sns = new AWS.SNS();
    this.ses = new AWS.SES({ region: awsConfig.ses.region });

    this.bucketName = awsConfig.s3.bucketName;

    if (!this.bucketName) {
      this.logger.error('S3 Bucket Name is not defined in configuration.');
      throw new Error('S3 Bucket Name is missing in configuration.');
    }

    this.logger.log('AWS Services initialized successfully');
  }

  /**
   * Uploads an image to AWS S3.
   * @param file The file object to upload.
   * @returns The URL of the uploaded image.
   */
  async uploadImage(file: any): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      this.logger.log(
        `File uploaded successfully. Location: ${uploadResult.Location}`,
      );
      return uploadResult.Location;
    } catch (error) {
      this.logger.error('Error uploading file to S3', error.stack);
      throw error;
    }
  }
}
