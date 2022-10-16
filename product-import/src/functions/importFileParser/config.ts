import { S3_BUCKET_NAME } from '@constants';
import { LambdaConfig } from '@libs/types';

export const importFileParserConfig: LambdaConfig = {
  events: [
    {
      s3: {
        bucket: S3_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/',
            suffix: '.csv',
          },
        ],
        existing: true,
      },
    },
  ],
};
