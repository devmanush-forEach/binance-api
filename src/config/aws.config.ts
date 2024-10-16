import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,

  s3: {
    bucketName: process.env.AWS_S3_BUCKET_NAME,
  },

  sqs: {
    queueUrl: process.env.AWS_SQS_QUEUE_URL,
  },

  sns: {
    topicArn: process.env.AWS_SNS_TOPIC_ARN,
  },

  ses: {
    region: process.env.AWS_SES_REGION,
  },
}));
